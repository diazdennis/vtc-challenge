<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Entity\Note;
use App\Entity\User;
use App\Enum\NoteCategory;
use App\Enum\NoteStatus;
use App\Repository\NoteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class NotesController extends AbstractController
{
    public function __construct(
        private NoteRepository $noteRepository
    ) {
    }

    /**
     * @Route("/api/notes", name="api_notes_list", methods={"GET"})
     */
    public function list(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $search = $request->query->get('search');
        $status = $request->query->get('status');
        $category = $request->query->get('category');

        // Validate status if provided
        if ($status && !in_array($status, NoteStatus::values())) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid status value.',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate category if provided
        if ($category && !in_array($category, NoteCategory::values())) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid category value.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $notes = $this->noteRepository->searchNotes($user, $search, $status, $category);

        return new JsonResponse([
            'success' => true,
            'notes' => array_map(fn(Note $note) => $note->toArray(), $notes),
        ]);
    }

    /**
     * @Route("/api/notes", name="api_notes_create", methods={"POST"})
     */
    public function create(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        if (!isset($data['title']) || !isset($data['content']) || !isset($data['category'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Title, content, and category are required.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $title = trim($data['title']);
        $content = trim($data['content']);
        $category = $data['category'];
        $status = $data['status'] ?? NoteStatus::NEW->value;

        if (empty($title)) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Title cannot be empty.',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($category, NoteCategory::values())) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid category value.',
            ], Response::HTTP_BAD_REQUEST);
        }

        if (!in_array($status, NoteStatus::values())) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Invalid status value.',
            ], Response::HTTP_BAD_REQUEST);
        }

        $note = new Note();
        $note->setTitle($title);
        $note->setContent($content);
        $note->setCategory($category);
        $note->setStatus($status);
        $note->setUser($user);

        $this->noteRepository->save($note, true);

        return new JsonResponse([
            'success' => true,
            'note' => $note->toArray(),
        ], Response::HTTP_CREATED);
    }

    /**
     * @Route("/api/notes/{id}", name="api_notes_get", methods={"GET"})
     */
    public function get(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $note = $this->noteRepository->findByUserAndId($user, $id);

        if (!$note) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Note not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'success' => true,
            'note' => $note->toArray(),
        ]);
    }

    /**
     * @Route("/api/notes/{id}", name="api_notes_update", methods={"PUT"})
     */
    public function update(int $id, Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $note = $this->noteRepository->findByUserAndId($user, $id);

        if (!$note) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Note not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $title = trim($data['title']);
            if (empty($title)) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Title cannot be empty.',
                ], Response::HTTP_BAD_REQUEST);
            }
            $note->setTitle($title);
        }

        if (isset($data['content'])) {
            $note->setContent(trim($data['content']));
        }

        if (isset($data['category'])) {
            if (!in_array($data['category'], NoteCategory::values())) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Invalid category value.',
                ], Response::HTTP_BAD_REQUEST);
            }
            $note->setCategory($data['category']);
        }

        if (isset($data['status'])) {
            if (!in_array($data['status'], NoteStatus::values())) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Invalid status value.',
                ], Response::HTTP_BAD_REQUEST);
            }
            $note->setStatus($data['status']);
        }

        $note->updateTimestamp();
        $this->noteRepository->save($note, true);

        return new JsonResponse([
            'success' => true,
            'note' => $note->toArray(),
        ]);
    }

    /**
     * @Route("/api/notes/{id}", name="api_notes_delete", methods={"DELETE"})
     */
    public function delete(int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $note = $this->noteRepository->findByUserAndId($user, $id);

        if (!$note) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Note not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        $this->noteRepository->remove($note, true);

        return new JsonResponse([
            'success' => true,
            'message' => 'Note deleted successfully.',
        ]);
    }

    /**
     * @Route("/api/categories", name="api_categories", methods={"GET"})
     */
    public function categories(): JsonResponse
    {
        $categories = array_map(
            fn(NoteCategory $category) => [
                'value' => $category->value,
                'label' => $category->label(),
            ],
            NoteCategory::cases()
        );

        $statuses = array_map(
            fn(NoteStatus $status) => [
                'value' => $status->value,
                'label' => ucfirst($status->value),
            ],
            NoteStatus::cases()
        );

        return new JsonResponse([
            'success' => true,
            'categories' => $categories,
            'statuses' => $statuses,
        ]);
    }
}
