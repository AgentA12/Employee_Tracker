# Employee Tracker

## User Story

AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

## About 

This application use's node js and MYsql with the mysql2 driver and the inquirer package. It is made to allow an employer to manage there employees.

##  Functionality

This application is a cli app that takes a series of prompts from a user and makes sql querys to an mysql database.

##  Usage 

Using git, clone the repository with ```git clone <respository code>```  

Install the npm dependencies using ```npm install```  

Then using mysql run ```source db/db.sql```  

Then ```source db/schema.sql``` and optionally seed the database with ```source db/seeds.sql```  

Then run ```node index.js ``` and follow the prompts.  

When you would like to exit select the EXIT option.
