<?php

$token = "7090713063:AAHAnxgBAXscTYjc6GgfH6vsOCVdKtz4v6s";
$chat_id = "-4231472135";

$phone = ($_POST['phone']);
$theme = ($_POST['theme']);
$contact = ($_POST['contact']);

$locations = ($_POST['locations']);
$types = ($_POST['types']);

$height = ($_POST['height']);
$width = ($_POST['width']);
$count = ($_POST['count']);

$parameters = ($_POST['parameters']);
$bonus=($_POST['bonus']);

$utm_source = $_POST['utm_source'];
$utm_medium = $_POST['utm_medium'];
$utm_campaign = $_POST['utm_campaign'];
$utm_content = $_POST['utm_content'];
$utm_term = $_POST['utm_term'];

$arr = array(
    'Сайт:' => 'https://yokna.by/',
    'Тема:' => $theme,
    'Телефон:' => $phone,
    'Мессенджер:' => $contact,
    '' => '',
    'Ответы на вопросы:' => ' ',
    '1. Куда устанавливаете окна?' => $locations,
    '2. Выберите необходимый тип окон (один или несколько):' =>  implode(", ", $types),
    'Размеры окна:' => ' ',
    '3. Высота' => $height,
    '4. Ширина' => $width,
    '5. Количество створок' => $count,
    '6. Выберите необходимый тип окон:' => implode(", ", $parameters),
    '7. Подарок' => $bonus,
    '' => '',
    'UTM метки' => '',
    'utm_source:' => $utm_source,
    'utm_medium:' => $utm_medium,
    'utm_campaign:' => $utm_campaign,
    'utm_content:' => $utm_content,
    'utm_term:' => $utm_term,
);

foreach($arr as $key => $value) {
    $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

?>
