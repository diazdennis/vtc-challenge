<?php

declare(strict_types=1);

namespace App\Service;

use Symfony\Component\Filesystem\Filesystem;

class EmailService
{
    private string $emailsDirectory;
    private Filesystem $filesystem;

    public function __construct(string $projectDir)
    {
        $this->emailsDirectory = $projectDir . '/var/emails';
        $this->filesystem = new Filesystem();
    }

    public function sendConfirmationEmail(string $email, string $confirmationToken): void
    {
        $this->ensureDirectoryExists();

        $confirmationUrl = '/confirm/' . $confirmationToken;
        
        $htmlContent = $this->generateEmailHtml($email, $confirmationUrl);
        
        $filename = sprintf('%d_%s.html', time(), str_replace('@', '_at_', $email));
        $filepath = $this->emailsDirectory . '/' . $filename;
        
        $this->filesystem->dumpFile($filepath, $htmlContent);
    }

    private function ensureDirectoryExists(): void
    {
        if (!$this->filesystem->exists($this->emailsDirectory)) {
            $this->filesystem->mkdir($this->emailsDirectory, 0755);
        }
    }

    private function generateEmailHtml(string $email, string $confirmationUrl): string
    {
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirm Your Account</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            color: #666;
            margin-bottom: 15px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Notes App!</h1>
        <p>Hello,</p>
        <p>Thank you for registering with email: <strong>{$email}</strong></p>
        <p>Please click the button below to confirm your account:</p>
        <a href="{$confirmationUrl}" class="button">Confirm My Account</a>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="{$confirmationUrl}">{$confirmationUrl}</a></p>
        <div class="footer">
            <p>If you did not create an account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }
}
