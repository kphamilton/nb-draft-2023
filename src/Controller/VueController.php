<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\HttpClientInterface;


class VueController extends AbstractController
{
    /**
     * @Route("/app/{route}", requirements={"route"=".*"}, name="vue")
     */
    public function index(Request $request): Response
    {

        return $this->render('index.html.twig', [ 'params' => [
            'controller_name' => 'VueController',
            'name' => 'Kevin Hamilton',
            'fish' => 'Test',
            'epic' => [],
        ]
        ]);
    }
    /**
     * @Route("/tags", name="gettags")
     */
    public function tags(Request $request): Response
    {
        $providers_lookup =[];
        return new JsonResponse(['tags'=>[], 'provider_lookup' => $providers_lookup], Response::HTTP_OK);
    }


}