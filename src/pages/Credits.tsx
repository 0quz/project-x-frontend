import React from 'react';
import { Button, Flex, Card, Typography, message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;

interface CreditPackage {
  price: number;
  points: number;
  priceId: string;
  description: string;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { price: 5, points: 50, priceId: 'price_1R9K4DBQH93l8eiUk3l0Jgr2', description: 'Perfect for starters' },
  { price: 10, points: 100, priceId: 'price_1R9NBFBQH93l8eiUcDNGi5TZ', description: 'Most popular' },
  { price: 25, points: 250, priceId: 'price_1R9NBgBQH93l8eiUQigq1lRW', description: 'Great value' },
  { price: 50, points: 500, priceId: 'price_1R9NBtBQH93l8eiUS1ff79wN', description: 'Power user' },
  { price: 100, points: 1000, priceId: 'price_1R9NCKBQH93l8eiUotwo1GTF', description: 'Best value' },
];

const Credits: React.FC = () => {
  const handleTopup = async (priceId: string) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/stripe/topup',
        { priceId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data as string;
    } catch (error) {
      message.error('Failed to initiate payment');
      console.error('Payment error:', error);
    }
  };

  return (
    <Flex vertical gap="large" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title level={2}>Purchase Points</Title>
        <Text type="secondary">Choose a package that suits your needs</Text>
      </div>

      {CREDIT_PACKAGES.map((pkg) => (
        <Card 
          key={pkg.price}
          hoverable 
          style={{ borderRadius: '8px' }}
        >
          <Flex justify="space-between" align="center">
            <div>
              <Title level={4}>${pkg.price}</Title>
              <Text>{pkg.points.toLocaleString()} points</Text>
              <br />
              <Text type="secondary">{pkg.description}</Text>
            </div>
            <Button 
              type="primary" 
              size="large"
              onClick={() => handleTopup(pkg.priceId)}
            >
              Purchase
            </Button>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default Credits;