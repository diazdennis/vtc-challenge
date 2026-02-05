<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\EmailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegistrationController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private EmailService $emailService,
        private ValidatorInterface $validator
    ) {
    }

    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Email and password are required.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $email = trim($data['email']);
        $password = $data['password'];

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid email format.',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check password length
        if (strlen($password) < 6) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Password must be at least 6 characters long.',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if user already exists
        $existingUser = $this->userRepository->findByEmail($email);
        if ($existingUser) {
            return new JsonResponse([
                'success' => false,
                'message' => 'An account with this email already exists.',
            ], Response::HTTP_CONFLICT);
        }

        // Create new user
        $user = new User();
        $user->setEmail($email);
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));
        $user->setConfirmationToken(bin2hex(random_bytes(32)));
        $user->setIsVerified(false);

        // Validate entity
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            return new JsonResponse([
                'success' => false,
                'message' => (string) $errors,
            ], Response::HTTP_BAD_REQUEST);
        }

        $this->userRepository->save($user, true);

        // Send confirmation email (saved as file)
        $this->emailService->sendConfirmationEmail($email, $user->getConfirmationToken());

        return new JsonResponse([
            'success' => true,
            'message' => 'Registration successful. Please check your email to confirm your account.',
        ], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/confirm/{token}", name="api_confirm", methods={"GET"})
     */
    public function confirm(string $token): JsonResponse
    {
        $user = $this->userRepository->findByConfirmationToken($token);

        if (!$user) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid or expired confirmation token.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($user->isVerified()) {
            return new JsonResponse([
                'success' => true,
                'message' => 'Account already confirmed.',
            ]);
        }

        $user->setIsVerified(true);
        $user->setConfirmationToken(null);
        $this->userRepository->save($user, true);

        return new JsonResponse([
            'success' => true,
            'message' => 'Account confirmed successfully. You can now log in.',
        ]);
    }
}
