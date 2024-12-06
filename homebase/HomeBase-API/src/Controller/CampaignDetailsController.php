<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class CampaignDetailsController extends AbstractController
{
    public function index(Request $request)
    {
        // Extract the id from the query param 
        $campaignId = $request->query->get('id');

        $em = $this->getDoctrine()->getManager();
        
        $qb = $em->createQueryBuilder();

        // Inner join campaigns with campaign attribution and campaign fields (filtered using campaign id)
        $qb
          ->select('v.id as verticalId', 'r.id as routeId', 'ca.isPaid', 'caf.value as caf_value', 'rf.value as rf_value', 'f.name')
          ->from('App\Entity\Campaigns','c')
          ->where('c.id = '. $campaignId)
          ->innerJoin('App\Entity\Verticals', 'v', 'WITH', 'v.id = c.verticalId')
          ->innerJoin('App\Entity\CampaignAttribution', 'ca', 'WITH', 'c.id = ca.campaignId')
          ->innerJoin('App\Entity\Routes', 'r', 'WITH', 'r.id = ca.routeId')
          ->innerJoin('App\Entity\RouteFields', 'rf', 'WITH', 'rf.routeId = ca.routeId')
          ->leftJoin('App\Entity\CampaignAttributionFields', 'caf', 'WITH', 'caf.campaignAttributionId = ca.id AND caf.routeFieldId = rf.id')
          ->innerJoin('App\Entity\Fields', 'f', 'WITH', 'f.id = rf.fieldId');

        // Execute query
        $data = $qb->getQuery()->getScalarResult();

        // If no campaign is found, return an error
        if (count($data) == 0) {
            $result = array(
                'error' => 'Campaign does not exist'
            );

            // Return the details
            $response = new JsonResponse();
            $response->setStatusCode(400);
            $response->setData($result);

            return $response;
        }

        // Format the campaign details so the caller can use them
        // This entails, making some info top level, and nesting fields in the
        // appropriate attribution

        // Extract verticalId and make it top level
        $result = array(
            'vertical_id' => $data[0]['verticalId'],
            'default' => array(
                'route_id' => '',
                'fields' => array()
            ),
            'paid' => array(
                'route_id' => '',
                'fields' => array()
            ),
        );

        // Loop through each field and place it in the correct category
        foreach ($data as &$row) {
            // If this is a paid route, store the route and fields in the paid array
            if ($row['isPaid'] == 1) {
                $result['paid']['route_id'] = $row['routeId'];
                // If the campaign attribution field is null, use the route field
                if (is_null($row['caf_value'])) $result['paid']['fields'][$row['name']] = $row['rf_value'];
                // Otherwise, use the campaign attribution field
                else $result['paid']['fields'][$row['name']] = $row['caf_value'];
            }
            // Otherwise, store the route and fields in the default array
            else {
                $result['default']['route_id'] = $row['routeId'];
                // If the campaign attribution field is null, use the route field
                if (is_null($row['caf_value'])) $result['default']['fields'][$row['name']] = $row['rf_value'];
                // Otherwise, use the campaign attribution field
                else $result['default']['fields'][$row['name']] = $row['caf_value'];
            }
        }

        // If there is no paid route, assign the default values to paid
        if ($result['paid']['route_id'] == '') {
            $result['paid'] = $result['default'];
        }

        // Return the details
        $response = new JsonResponse();
        $response->setStatusCode(200);
        $response->setData($result);

        return $response;
    }
}
