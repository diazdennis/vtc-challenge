<?php

declare(strict_types=1);

namespace App\Entity;

use App\Enum\NoteCategory;
use App\Enum\NoteStatus;
use App\Repository\NoteRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=NoteRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
class Note
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id = null;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private ?string $title = null;

    /**
     * @ORM\Column(type="text")
     */
    private ?string $content = null;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private ?string $category = null;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private ?string $status = null;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="notes")
     * @ORM\JoinColumn(nullable=false)
     */
    private ?User $user = null;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->status = NoteStatus::NEW->value;
    }

    /**
     * @ORM\PreUpdate
     */
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function getCategoryEnum(): ?NoteCategory
    {
        return $this->category ? NoteCategory::from($this->category) : null;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function setCategoryEnum(NoteCategory $category): self
    {
        $this->category = $category->value;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function getStatusEnum(): ?NoteStatus
    {
        return $this->status ? NoteStatus::from($this->status) : null;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function setStatusEnum(NoteStatus $status): self
    {
        $this->status = $status->value;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'category' => $this->category,
            'status' => $this->status,
            'createdAt' => $this->createdAt?->format('c'),
            'updatedAt' => $this->updatedAt?->format('c'),
        ];
    }
}
