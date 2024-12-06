<?php
// src/Controller/ApiController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use App\Entity\Keywords;

class ApiController extends Controller
{
    // Handler for accounts route
    public function getAccounts(Request $request)
    {
      // Access raw query function repository
      $em = $this->getDoctrine()->getManager();
      $kw = $em->getRepository(Keywords::class);

      // Extract content from request
      $content = $request->query->all();
      // Format the query options using the request content
      $options = $this->generateFilterOptions($content, $em);

      // Execute query
      $result = $kw->getAccountsRawQuery($options);

      // Return response
      $response = new JsonResponse();
      $response->setStatusCode(200);
      $response->setData($result);
      return $response;
    }

    // Handler for campaigns route
    public function getCampaigns(Request $request)
    {
      // Access raw query function repository
      $em = $this->getDoctrine()->getManager();
      $kw = $em->getRepository(Keywords::class);

      // Extract content from request
      $content = $request->query->all();
      // Format the query options using the request content
      $options = $this->generateFilterOptions($content, $em);

      // Execute query
      $result = $kw->getCampaignsRawQuery($options);

      // Return response
      $response = new JsonResponse();
      $response->setStatusCode(200);
      $response->setData($result);
      return $response;
    }

    // Handler for adgroups route
    public function getAdgroups(Request $request)
    {
      // Access raw query function repository
      $em = $this->getDoctrine()->getManager();
      $kw = $em->getRepository(Keywords::class);

      // Extract content from request
      $content = $request->query->all();
      // Format the query options using the request content
      $options = $this->generateFilterOptions($content, $em);

      // Execute query
      $result = $kw->getAdgroupsRawQuery($options);

      // Return response
      $response = new JsonResponse();
      $response->setStatusCode(200);
      $response->setData($result);
      return $response;
    }

    // Handler for creatives route
    public function getCreatives(Request $request)
    {
      // Access raw query function repository
      $em = $this->getDoctrine()->getManager();
      $kw = $em->getRepository(Keywords::class);

      // Extract content from request
      $content = $request->query->all();
      // Format the query options using the request content
      $options = $this->generateFilterOptions($content, $em);

      // Execute query
      $result = $kw->getCreativesRawQuery($options);

      // Return response
      $response = new JsonResponse();
      $response->setStatusCode(200);
      $response->setData($result);
      return $response;
    }

    // Handler for keywords route
    public function getKeywords(Request $request)
    {
      // Access raw query function repository
      $em = $this->getDoctrine()->getManager();
      $kw = $em->getRepository(Keywords::class);

      // Extract content from request
      $content = $request->query->all();
      // Format the query options using the request content
      $options = $this->generateFilterOptions($content, $em);

      // Execute query
      $result = $kw->getKeywordsRawQuery($options);

      // Return response
      $response = new JsonResponse();
      $response->setStatusCode(200);
      $response->setData($result);
      return $response;
    }
    
    public function getRow(Request $request) {
      $em = $this->getDoctrine()->getManager();

      $content = $request->query->all();
      $filters = json_decode($content['filters'], true);

      $kw = $em->getRepository(Keywords::class);

      $result = $kw->getRow($filters);

      if($result) {
        $result = $result[0];
      } else {
        $result = new \stdClass();
      }

      $response = new JsonResponse();
      $response->setStatusCode(200);
      $response->setData($result);
      return $response;
    }

    // Generate all the necessary filters for the queries
    public function generateFilterOptions($content, $em) {
      // All content options are false by default
      $fields = false;
      $date = false;

      // Extract options from content (retrieved from query param)
      if(isset($content['filters'])){
        $filters = json_decode($content['filters'], true);
        if(isset($filters['fields'])){
          $fields = $filters['fields'];
        }
        if(isset($filters['date'])){
          $date = $filters['date'];
        }
      }

      // Default date options
      $startDate = '2019-01-01';
      $endDate = '2019-01-31';
      // Overridden date options
      if($date) {
          $startDate = $date['start'];
          $endDate = $date['end'];
      }

      // Determine what filters were provided to generate where statement
      $where = [];
      if ($fields) {
          foreach ($fields as $field) {
              switch($field['type']) {
                  case 'equals':
                      $where[] = $field['key'] . ' = ' . $em->getConnection()->quote($field['value']);
                  break;
                  case 'contains':
                      $where[] = $field['key'] . ' LIKE ' . $em->getConnection()->quote('%'.$field['value'].'%');
                  break;
                  case 'doesNotContain':
                      $where[] = $field['key'] . ' NOT LIKE ' . $em->getConnection()->quote('%'.$field['value'].'%');
                  break;
                  case 'isBlank':
                      $where[] = $field['key'] . ' <= ""';
                  break;
                  case 'isNotBlank':
                      $where[] = $field['key'] . ' > ""';
                  break;
                  case 'between':
                      $where[] = $field['key'] . ' >= ' . $field['value']['start'] . ' && ' . $field['key'] . ' <= ' . $field['value']['end'];
                  break;
                  default:
                      $where[] = $field['key'] . ' ' . $field['type'] . $em->getConnection()->quote($field['value']);
                  break;
              }
          }
      }
      // Connect all filter conditions to form final where statement
      if($where) {
          $where = implode(' AND ', $where);
          $where = 'WHERE ' . $where;
      } else {
          $where = '';
      }

      // Return the options array
      return array(
          'where' => $where,
          'startDate' => $startDate,
          'endDate' => $endDate
      );
  }
}