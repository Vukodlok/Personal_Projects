#! /bin/bash
PSQL="psql --username=freecodecamp --dbname=salon --no-align --tuples-only -c"

echo -e "\nWelcome to Simpson's Salon, where we can comb three hairs or shape a pineapple head! Here are our services:\n"

LIST_SERVICES() {
  SERVICES=$($PSQL "SELECT service_id, name FROM services;")
  echo "$SERVICES" | while IFS="|" read SERVICE_ID SERVICE_NAME; do
    echo "$SERVICE_ID) $SERVICE_NAME"
  done
}

SELECT_SERVICE() {
  echo -e "\nPlease enter the number of the service you would like."
  read SERVICE_ID_SELECTED

  SERVICE_EXISTS=$($PSQL "SELECT service_id FROM services WHERE service_id = $SERVICE_ID_SELECTED;")
  if [[ -z $SERVICE_EXISTS ]]; then
    echo -e "\nInvalid selection, please enter a valid service number."
    LIST_SERVICES
    SELECT_SERVICE #reprompt function call recursively
  fi
}

CUSTOMER_INFO() {
  echo -e "\nEnter your phone number(format:###-####):"
  read CUSTOMER_PHONE
  CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone = '$CUSTOMER_PHONE';")
  if [[ -z $CUSTOMER_NAME ]]; then
    echo -e "\n It looks like you're a new customer! Welcome, please enter your name:"
    read CUSTOMER_NAME
    INSERT_CUSTOMER=$($PSQL "INSERT INTO customers(name, phone) VALUES('$CUSTOMER_NAME', '$CUSTOMER_PHONE');")
fi
}

SET_APPOINTMENT() {
  echo -e "\nWhat time would you like your appointment?"
  read SERVICE_TIME
  CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE';")
  INSERT_APPOINTMENT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME');")
  SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED;")
  echo -e "\nI have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
}

LIST_SERVICES
SELECT_SERVICE
CUSTOMER_INFO
SET_APPOINTMENT
