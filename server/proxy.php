<?php

$data = file_get_contents('php://input');

// Декодуємо JSON в асоціативний масив
$dataArray = json_decode($data, true);

// Перевіряємо, чи вдалося декодувати JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Невірний формат JSON']);
    exit;
}

// Припустимо, що ми хочемо передати email з отриманих даних
$email = isset($dataArray['email']) ? $dataArray['email'] : 'default@example.com';


$fullLink = 'https://api.selzy.com/en/api/subscribe?format=json&api_key=6a7x15ac8s9qnekzwufrkq85m7gsbd1b94tu83uo&list_ids=25&fields[email]=' . $email . '&tags=new_subscriber&double_optin=3&overwrite=0';
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => $fullLink,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;