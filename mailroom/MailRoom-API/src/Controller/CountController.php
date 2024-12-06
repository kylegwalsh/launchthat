<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;


class CountController extends AbstractController
{
    public function index()
    {
        $em = $this->getDoctrine()->getManager();
        
        $results = array(
            'email_endpoints' => '',
            'endpoints' => '',
            'field_maps' => '',
            'http_endpoints' => '',
            'leads' => '',
            'response_records' => '',
            'route_endpoint_maps' => '',
            'users' => '',
        );

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(ee.id)')->from('App\Entity\EmailEndpoints','ee');
        $results['email_endpoints'] = $qb->getQuery()->getSingleScalarResult();


        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(e.id)')->from('App\Entity\Endpoints','e');
        $results['endpoints'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(fm.id)')->from('App\Entity\FieldMaps','fm');
        $results['field_maps'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(he.id)')->from('App\Entity\HttpEndpoints','he');
        $results['http_endpoints'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(l.id)')->from('App\Entity\Leads','l');
        $results['leads'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(rr.id)')->from('App\Entity\ResponseRecords','rr');
        $results['response_records'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(rem.id)')->from('App\Entity\RouteEndpointMaps','rem');
        $results['route_endpoint_maps'] = $qb->getQuery()->getSingleScalarResult();

        $qb = $em->createQueryBuilder();
        $qb->select('COUNT(u.id)')->from('App\Entity\Users','u');
        $results['users'] = $qb->getQuery()->getSingleScalarResult();

        $response = new JsonResponse();
        $response->setStatusCode(200);
        $response->setData($results);

        return $response;
    }
}
