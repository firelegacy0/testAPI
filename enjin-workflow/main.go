package main

import (
	"fmt"
	"time"
)

func main() {
	// Create a zero value time.Time object
	var zeroTime time.Time

	// Load the Asia/Kuala_Lumpur location
	loc, err := time.LoadLocation("Asia/Kuala_Lumpur")
	if err != nil {
		fmt.Println("Error loading location:", err)
		return
	}

	if zeroTime.IsZero() {
		fmt.Println("This is zero time")
		fmt.Println("Time before: ", zeroTime)
		formattedTime := (time.Now()).In(loc).Format("02 Jan 2006 3:04pm")

		fmt.Println("Time now: ", formattedTime)
	}
	// Format the zero time value in the specified location
	formattedTime := zeroTime.In(loc).Format("02 Jan 2006 3:04pm")

	// Print the formatted time
	fmt.Println("Formatted zero time in Asia/Kuala_Lumpur:", formattedTime)
}
