<?php
// Mengizinkan CORS agar request dari front-end dapat diterima
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json'); // Response format JSON

// Import library Midtrans
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

// Konfigurasi Midtrans
\Midtrans\Config::$serverKey = 'SB-Mid-server-0m5i4-W0dvmDBwLB6uiWXQps';
\Midtrans\Config::$isProduction = false; // Ubah ke true untuk mode produksi
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

try {
    // Validasi input POST
    if (!isset($_POST['total']) || !isset($_POST['items']) || !isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['phone'])) {
        throw new Exception("Data input tidak lengkap!");
    }

    // Parameter transaksi Midtrans
    $params = array(
        'transaction_details' => array(
            'order_id' => uniqid('ORDER-', true), // Order ID unik
            'gross_amount' => (int) $_POST['total'], // Total pembayaran
        ),
        'item_details' => json_decode($_POST['items'], true), // Daftar item dalam format array
        'customer_details' => array(
            'first_name' => htmlspecialchars($_POST['name']), // Nama customer
            'email' => htmlspecialchars($_POST['email']), // Email customer
            'phone' => htmlspecialchars($_POST['phone']), // Nomor telepon customer
        ),
    );

    // Mendapatkan Snap Token dari Midtrans
    $snapToken = \Midtrans\Snap::getSnapToken($params);

    // Mengirimkan Snap Token ke front-end
    echo json_encode(['token' => $snapToken]);
} catch (Exception $e) {
    // Menangkap error dan mengirimkan response error
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => $e->getMessage()]);
}
?>
