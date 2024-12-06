<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Aws\Sns\SnsClient;
use Aws\Sns\Exception\SnsException;

class ReFireController extends AbstractController
{
    public function index(Request $request, SnsClient $sns)
    {
         $content = $request->getContent();
         $content = json_decode($content, true);

         if (isset($content['endpoints']) && "" !== $content['endpoints']) {
             foreach($content['endpoints'] as $ep) {
                $refire = [];
                $refire = array_merge($ep, $content['data']);

                $data = json_encode($refire);
                try {
                    $response = $sns->publish([
                        'Message' => $data,
                        'TopicArn' => $this->getParameter('mailroom_topic'),
                    ]);
                } catch (SnsException $e) {
                    
                    $response = new JsonResponse();
                    $response->setdata($e);
                    $response->setstatuscode(200);
                    return $response;
                }

             }

         }

        $response = new JsonResponse();
        $response->setdata('success');
        $response->setStatusCode(200);

        return $response;
    }

    public function all(Request $request, SnsClient $sns)
    {
        $em = $this->getDoctrine()->getManager();

        $sql = "SELECT * FROM (SELECT id AS response_id, status_code, endpoint_id, lead_id FROM response_records) AS rr RIGHT JOIN (SELECT * FROM leads AS l INNER JOIN (SELECT route_id AS rem_route_id, endpoint_id FROM route_endpoint_maps INNER JOIN endpoints ON route_endpoint_maps.endpoint_id = endpoints.id WHERE endpoints.active = true) AS rem ON l.route_id = rem.rem_route_id WHERE l.delivery_status = 'unsent' OR l.delivery_status = 'failed') AS special ON rr.lead_id = special.id AND rr.endpoint_id = special.endpoint_id";

        $stmt = $em->getConnection()->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll();

        foreach ($results as $r) {
            if (is_null($r['status_code']) || (int) $r['status_code'] < 200 || (int) $r['status_code'] > 299 ) {
                $data = [];
                $data['id'] = $r['endpoint_id'];
                if ($r['response_id']) {
                    $data['responseId'] = $r['response_id'];
                }
                $fields = json_decode($r['fields'], true);
                $data['fields'] = $fields;
                $data['channel'] = $r['channel'];
                $data['lead_id'] = $r['id'];
                $data['lead_version'] = $r['version'];
                $data['site_name'] = $r['site_id'];
                $data['created_at'] = $r['created_at'];
                $data['route'] = ['id'=> $r['route_id'], 'name' => $r['route_id']];

                $data = json_encode($data);

                try {
                    $response = $sns->publish([
                        'Message' => $data,
                        'TopicArn' => $this->getParameter('mailroom_topic'),
                    ]);
                } catch (SnsException $e) {
                    $response = new JsonResponse();
                    $response->setdata($e);
                    $response->setstatuscode(200);
                    return $response;
                }
            }

        }
        $response = new JsonResponse();
        $response->setdata('success');
        $response->setStatusCode(200);

        return $response;

    }

}
