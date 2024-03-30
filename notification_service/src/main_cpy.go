// package main

// import (
// 	"context"
// 	"encoding/json"
// 	"fmt"
// 	"log"
// 	"os"

// 	amqp "github.com/rabbitmq/amqp091-go"
// )

// // Notification struct represents a notification message
// type Notification struct {
// 	Type    string `json:"type"`
// 	Message string `json:"message"`
// 	// Add any additional fields for specific notification types here
// }

// func main() {
// 	// RabbitMQ connection details (replace with your server information)
// 	//amqpURI := "amqp://guest:guest@localhost:5672/"
// 	amqpURI := os.Getenv("AMQP_URL")
// 	fmt.Println(amqpURI)
// 	exchangeName := "notifications"

// 	// Connect to RabbitMQ
// 	conn, err := amqp.Dial(amqpURI)
// 	if err != nil {
// 		fmt.Print(":")
// 		log.Fatal(err)
// 	}

// 	defer conn.Close()
// 	fmt.Println("It reaches this!")
// 	// Open a channel
// 	ch, err := conn.Channel()
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer ch.Close()

// 	// Declare the exchange (optional, create if not exists)
// 	err = ch.ExchangeDeclare(
// 		exchangeName, // Name of the exchange
// 		"fanout",     // Exchange type (fanout for broadcasting)
// 		true,         // Durable exchange
// 		false,        // Auto-delete exchange
// 		false,        // Internal exchange
// 		false,        // No wait
// 		nil,          // Arguments
// 	)
// 	if err != nil {
// 		log.Println("Exchange declaration:", err)
// 	}

// 	// Function to send a notification
// 	sendNotification := func(notification Notification) error {
// 		// Marshal notification to JSON
// 		data, err := json.Marshal(notification)
// 		if err != nil {
// 			return err
// 		}

// 		// Publish the message to the exchange
// 		err = ch.PublishWithContext(
// 			context.Background(), // Empty context
// 			exchangeName,         // Exchange name
// 			"",                   // Routing key (empty for fanout)
// 			false,                // Mandatory
// 			false,                // Immediate
// 			amqp.Publishing{
// 				ContentType: "application/json",
// 				Body:        data,
// 			},
// 		)
// 		if err != nil {
// 			return err
// 		}

// 		fmt.Println("Notification sent:", notification)
// 		return nil
// 	}

// 	// Example usage
// 	notification := Notification{
// 		Type:    "info",
// 		Message: "A new task has been created!",
// 	}

// 	err = sendNotification(notification)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// }
