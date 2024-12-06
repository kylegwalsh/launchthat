<?php

namespace App\Repository;

use App\Entity\AsbestosLeads;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method AsbestosLeads|null find($id, $lockMode = null, $lockVersion = null)
 * @method AsbestosLeads|null findOneBy(array $criteria, array $orderBy = null)
 * @method AsbestosLeads[]    findAll()
 * @method AsbestosLeads[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AsbestosLeadsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, AsbestosLeads::class);
    }

    // /**
    //  * @return AsbestosLeads[] Returns an array of AsbestosLeads objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?AsbestosLeads
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
