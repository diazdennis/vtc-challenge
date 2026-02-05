<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Note;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Note>
 * @method Note|null find($id, $lockMode = null, $lockVersion = null)
 * @method Note|null findOneBy(array $criteria, array $orderBy = null)
 * @method Note[]    findAll()
 * @method Note[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NoteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Note::class);
    }

    public function save(Note $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Note $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Search and filter notes for a user
     *
     * @param User $user
     * @param string|null $search Search text in title and content
     * @param string|null $status Filter by status
     * @param string|null $category Filter by category
     * @return Note[]
     */
    public function searchNotes(User $user, ?string $search = null, ?string $status = null, ?string $category = null): array
    {
        $qb = $this->createQueryBuilder('n')
            ->where('n.user = :user')
            ->setParameter('user', $user)
            ->orderBy('n.updatedAt', 'DESC');

        if ($search) {
            $qb->andWhere('n.title LIKE :search OR n.content LIKE :search')
                ->setParameter('search', '%' . $search . '%');
        }

        if ($status) {
            $qb->andWhere('n.status = :status')
                ->setParameter('status', $status);
        }

        if ($category) {
            $qb->andWhere('n.category = :category')
                ->setParameter('category', $category);
        }

        return $qb->getQuery()->getResult();
    }

    public function findByUserAndId(User $user, int $id): ?Note
    {
        return $this->findOneBy(['user' => $user, 'id' => $id]);
    }
}
