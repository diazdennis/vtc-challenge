<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class SecurityController extends AbstractController
{
    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    public function login(): JsonResponse
    {
        // This method will never be called because the JSON login authenticator handles /api/login
        // The success/failure handlers return the response
        return new JsonResponse([
            'success' => false,
            'message' => 'Missing credentials',
        ], Response::HTTP_BAD_REQUEST);
    }

    /**
     * @Route("/api/logout", name="api_logout", methods={"POST"})
     */
    public function logout(): void
    {
        // This method can be blank - it will be intercepted by the logout key on the firewall
        throw new \LogicException('This method should never be reached.');
    }

    /**
     * @Route("/api/user", name="api_user", methods={"GET"})
     */
    public function getCurrentUser(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Not authenticated',
            ], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'success' => true,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
            ],
        ]);
    }
}
