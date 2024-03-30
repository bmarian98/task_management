package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Task struct {
	Id         string `json:"id"`
	OwnerID    string `json:"owner_id"`
	AssigneeID string `json:"assignee_id"`
	Content    string `json:"content"`
	CreatedAt  string `json:"created_at"`
	Read       bool   `json:"read"`
}

var client *mongo.Client
var collection *mongo.Collection

func connectToDB() error {
	err := godotenv.Load() // Load environment variables for connection details
	if err != nil {
		return fmt.Errorf("failed to load environment variables: %w", err)
	}

	// Replace placeholders with your actual MongoDB connection details
	uri := os.Getenv("MONGODB_URI")
	dbName := os.Getenv("MONGODB_DATABASE")

	ctx := context.Background()
	client, err = mongo.Connect(ctx, options.Client().URI(uri))
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	collection = client.Database(dbName).Collection("notifications")
	return nil
}

func disconnectFromDB() {
	if client != nil {
		ctx := context.Background()
		err := client.Disconnect(ctx)
		if err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		}
	}
}

func connectToRabbitMQ() (*amqp.Channel, error) {
	// RabitMQ connection details (replace with yours)
	amqpURI := os.Getenv("AMQP_URL")

	// Connect to RabbitMQ
	conn, err := amqp.Dial(amqpURI)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	// Create a channel
	ch, err := conn.Channel()

	if err != nil {
		return nil, fmt.Errorf("failed to open a channel: %w", err)
	}

	return ch, nil

}

func declareQueue(ch *amqp.Channel) error {
	_, err := ch.QueueDeclare(
		"notifications", // Queue name
		false,           // Durable (survives server restarts)
		false,           // Delete when unused
		false,           // Exclusive (only this connection can access)
		false,           // <-- Add this argument (auto-delete when no consumers)
		nil,             // Arguments
	)
	return err
}

func sendNotificationHandler(w http.ResponseWriter, r *http.Request) {
	var task Task
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&task)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid task data: %v", err)
		return
	}

	ch, err := connectToRabbitMQ()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to connect to RabbitMQ: %v", err)
		return
	}
	defer ch.Close()

	err = declareQueue(ch)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to declare queue: %v", err)
		return
	}

	data, err := json.Marshal(task)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to marshal task data: %v", err)
		return
	}

	err = ch.PublishWithContext(
		context.Background(), // Add context argument
		"",                   // Exchange (empty for default)
		"notifications",      // Routing key
		false,                // Mandatory
		false,                // Immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        data,
		},
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to publish message: %v", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func getNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("id") // Get user ID from query parameter

	// Implement logic to retrieve notifications from data store
	// Filter based on ownerId or assigneeId matching userId and Read field
	notifications := []Task{} // Placeholder for retrieved notifications

	// Filter notifications based on Read and ownership
	for _, notification := range retrievedNotifications { // Replace with actual retrieval
		if notification.Read == false &&
			(notification.OwnerID == userId || notification.AssigneeID == userId) {
			notifications = append(notifications, notification)
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(notifications)
}

func markAsReadHandler(w http.ResponseWriter, r *http.Request) {
	taskId := mux.Vars(r)["id"] // Get task ID from path parameter

	// Implement logic to mark task as read
	// Update the "Read" field to true

	// Replace with your data store update logic
	err := updateNotificationReadStatus(taskId, true)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to mark notification as read: %v", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func deleteNotificationHandler(w http.ResponseWriter, r *http.Request) {
	taskId := mux.Vars(r)["id"] // Get task ID from path parameter

	// Implement logic to delete notification
	// Remove notification from data store

	// Replace with your data store deletion logic
	err := deleteNotification(taskId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to delete notification: %v", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("id") // Get user ID from query parameter

	err := connectToDB() // Connect to MongoDB if not already connected
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to connect to MongoDB: %v", err)
		return
	}
	defer disconnectFromDB() // Disconnect on function exit

	filter := bson.M{
		"$or": []interface{}{
			bson.M{"owner_id": userId},
			bson.M{"assignee_id": userId},
		},
		"read": false,
	}

	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to retrieve notifications: %v", err)
		return
	}
	defer cursor.Close(context.Background())

	var notifications []Task
	if err := cursor.All(context.Background(), &notifications); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to decode notifications: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(notifications)
}

func updateNotificationReadStatus(id string, read bool) error {
	err := connectToDB() // Connect to MongoDB if not already connected
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}
	defer disconnectFromDB() // Disconnect on function exit

	update := bson.M{"$set": bson.M{"read": read}}
	filter := bson.M{"id": id}

	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update notification read status: %w", err)
	}

	return nil
}

func deleteNotification(id string) error {
	err := connectToDB() // Connect to MongoDB if not already connected
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}
	defer disconnectFromDB() // Disconnect on function exit

	filter := bson.M{"id": id}
	result, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return fmt.Errorf("failed to delete notification: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("notification with ID %s not found", id)
	}

	return nil
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/send-notification", sendNotificationHandler).Methods(http.MethodPost)
	router.HandleFunc("/get-notifications", getNotificationsHandler).Methods(http.MethodGet)
	router.HandleFunc("/notifications/{id}/mark-as-read", markAsReadHandler).Methods(http.MethodPost)
	router.HandleFunc("/notifications/{id}", deleteNotificationHandler).Methods(http.MethodDelete)

	log.Fatal(http.ListenAndServe(":8080", router)) // Replace with your desired port
}
