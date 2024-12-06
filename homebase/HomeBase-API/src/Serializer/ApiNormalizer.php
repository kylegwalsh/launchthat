<?php
// api/src/Serializer/ApiNormalizer

namespace App\Serializer;

use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerAwareInterface;
use Symfony\Component\Serializer\SerializerInterface;

final class ApiNormalizer implements NormalizerInterface, DenormalizerInterface, SerializerAwareInterface
{
    private $decorated;

    public function __construct(NormalizerInterface $decorated)
    {
        if (!$decorated instanceof DenormalizerInterface) {
            throw new \InvalidArgumentException(sprintf('The decorated normalizer must implement the %s.', DenormalizerInterface::class));
        }

        $this->decorated = $decorated;
    }

    public function supportsNormalization($data, $format = null)
    {
        return $this->decorated->supportsNormalization($data, $format);
    }

    public function normalize($object, $format = null, array $context = [])
    {
        $data = $this->decorated->normalize($object, $format, $context);
        if (is_array($data)) {
            if (isset($data['verticalId'])) {
                $val = (int)str_replace('/api/verticals/', '', $data['verticalId']);
                $data['verticalId'] = $val;
            }
            if (isset($data['routeId'])) {
                $val = (int)str_replace('/api/routes/', '', $data['routeId']);
                $data['routeId'] = $val;
            }

            if (isset($data['fieldId'])) {
                $val = (int)str_replace('/api/fields/', '', $data['fieldId']);
                $data['fieldId'] = $val;
            }

            if (isset($data['campaignAttributionId'])) {
                $val = (int)str_replace('/api/campaign_attributions/', '', $data['campaignAttributionId']);
                $data['campaignAttributionId'] = $val;
            }

            if (isset($data['campaignId'])) {
                $val = (int)str_replace('/api/campaigns/', '', $data['campaignId']);
                $data['campaignId'] = $val;
            }

            if (isset($data['routeFieldId'])) {
                $val = (int)str_replace('/api/route_fields/', '', $data['routeFieldId']);
                $data['routeFieldId'] = $val;
            }

            if (isset($data['userId'])) {
                $val = (int)str_replace('/api/user/', '', $data['userId']);
                $data['userId'] = $val;
            }
        }

        return $data;
    }

    public function supportsDenormalization($data, $type, $format = null)
    {
        return $this->decorated->supportsDenormalization($data, $type, $format);
    }

    public function denormalize($data, $class, $format = null, array $context = [])
    {
        return $this->decorated->denormalize($data, $class, $format, $context);
    }
    
    public function setSerializer(SerializerInterface $serializer)
    {
        if($this->decorated instanceof SerializerAwareInterface) {
            $this->decorated->setSerializer($serializer);
        }
    }
}
