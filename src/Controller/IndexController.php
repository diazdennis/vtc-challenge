<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    /**
     * @Route("/", name="app_index")
     * @Route("/login", name="app_login_page")
     * @Route("/register", name="app_register_page")
     * @Route("/confirm/{token}", name="app_confirm_page")
     * @Route("/notes", name="app_notes_page")
     * @Route("/notes/new", name="app_notes_new_page")
     * @Route("/notes/{id}/edit", name="app_notes_edit_page", requirements={"id"="\d+"})
     */
    public function index(): Response
    {
        return $this->render('index.html.twig');
    }
}
