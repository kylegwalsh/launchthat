<?php

namespace App\Repository;

use App\Entity\KeywordResult;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method KeywordResult|null find($id, $lockMode = null, $lockVersion = null)
 * @method KeywordResult|null findOneBy(array $criteria, array $orderBy = null)
 * @method KeywordResult[]    findAll()
 * @method KeywordResult[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class KeywordResultRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, KeywordResult::class);
    }

    // /**
    //  * @return KeywordResult[] Returns an array of KeywordResult objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('k')
            ->andWhere('k.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('k.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?KeywordResult
    {
        return $this->createQueryBuilder('k')
            ->andWhere('k.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
