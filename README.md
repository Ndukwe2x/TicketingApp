# LightUpTicketingApp

 **Description:**
 <!-- no toc -->
A code base for a web event ticket sales application. The project is a web platform for selling tickets 
to the public for  events and shows etc. Platform owner(s) will  add events and create accounts for
event owners and organizers.

Event owners will setup their event details,  which will simultaneously configure the details on platform and provide a ticket purchase flow for the event.

## Project Milestones
  1.  Platform administrator having the ability to create events and accounts for event owners.
  2.  A well designed and attractive interface for the front-end through which web visitors will purchase
      event tickets.
  3.  An easy to use ticket purchasing process/flow for web visitors.
  4.  Platform's ability to generate and send email to web visitor after ticket purchase.
  5.  The platform's ability to send SMS after ticket purchase SMS will bear the reference number of that
      purchase.
  6.  Activation of a complainant system for web visitors to lodage issues and make inquiries.

  ## Project Use Cases.

  ## Project Technology Statck.
  -   **Version Control System:** Github
  -   **Front-End:** React
  -   **Database:**  MongoDB
  -   **Back-End:**  Node(Express).js

 ### Branching Strategy
    The version control system will have 3 major branches for the workflow repo
    i.   Main branch
    ii.  React branch
    iii. Node-Express branch


 #### **Notes**

  -   The main branch will have the most updated version of the entire deployable source code.
  -   The React branch will store the front-end source codes in it's underlying directory structure.The  
      developer can create feauture branches locally off the react branch and update the react branch via merge requests to the corresponding github branch. After testing  the local react branch will be merged with the main branch.
        -  Hot fix branches can be created off this branch for the purpose of fixing unintended bugs.
  -   The Node-Express branch will store the back-end source codes. Feature branches can be created 
      locally off this branch. The developer will make a push request to the correponding github branch
      with a version of working code.
        -  Hot fix branch(s) can also be created off this branch to fix bugs.
        -  After the source is deemed satisfactory, it will also be merged after a push to the corresponding
          github within it's underlying directory.

 ## Database Structure

  -   **Database tech:**   NoSQL
  -   **Database vendor:** MongoDB
  -   **Database Name:**   TicketingApp
    
   #### Structure

   ##### Collections and Document Schema
     i.   **Accounts**

         Email: String
         FirstName:  String
         LastName:  String
         Phone:   String
         AccountType: String [Owner, Event-planner]
         Role: String [Super,Advanced, Basic]
         Avatar:   String
         CreatedAt: Date
        
     ii.   **Events**

         Title: String
         EventDate: Date
         Location(Street): String
         City: String
         Sate: String
         TicketCategories: String
         TicketClosingDate: Date
         EventBanner: String
         EventPoster: String
         CreatedAt: Date

     iii.   **TicketSales**

          EventRef: String
          CustomerName: String
          CustomerEmail: String
          Phone:  String
          DateOfPurchase: Date
          TicketCategory: String
          ReferenceNo: String
          Quantity: Number
          AmountPaid: Number
