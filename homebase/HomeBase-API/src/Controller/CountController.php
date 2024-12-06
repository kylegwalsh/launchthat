<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Sites;


class CountController extends AbstractController
{
    public function index()
    {
        $em = $this->getDoctrine()->getManager();
        
        $results = array(
            'campaigns' => '',
            'fields' => '',
            'routes' => '',
            'sites' => '',
            'verticals' => '',
        );

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(c.id)')->from('App\Entity\Campaigns','c');
        $results['campaigns'] = $qb->getQuery()->getSingleScalarResult();


        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(f.id)')->from('App\Entity\Fields','f');
        $results['fields'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(r.id)')->from('App\Entity\Routes','r');
        $results['routes'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(s.id)')->from('App\Entity\Sites','s');
        $results['sites'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(v.id)')->from('App\Entity\Verticals','v');
        $results['verticals'] = $qb->getQuery()->getSingleScalarResult();

        $response = new JsonResponse();
        $response->setStatusCode(200);
        $response->setData($results);

        return $response;
    }
}
