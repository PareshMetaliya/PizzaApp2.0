import food_delivery from "../assets/food-delivery.png";
import Easy_Order from "../assets/Easy Order.png";
import Best_Quality from "../assets/Best Quality.png";

type WhatWeServeCardProps = {
  id: number,
  imgsrc: string,
  title: string,
  desc: string,
  desc2: string
}

export const whatWeServeData:WhatWeServeCardProps[] = [
    { id: 1, imgsrc: food_delivery, title: "Fastest Delivery.", desc: "Fulfilling your cravings with the", desc2: "fastest wheels in town" },
    { id: 2, imgsrc: Easy_Order, title: "Easy Ordering.", desc: "Easiest way to deliciousness",desc2:"Order now with a breeze!" },
    { id: 3, imgsrc: Best_Quality, title: "Best Quality", desc: "Savor perfection with every bite where",desc2:" quality meets culinary artistry" },
];


export const CustomerReviews = [
    {
      id: 1,
      name: 'John Doe',
      image: 'https://randomuser.me/api/portraits/men/10.jpg', // Dummy image URL
      review: 'Great product! I am extremely happy with the quality and customer service. Would definitely recommend it.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: 'https://randomuser.me/api/portraits/women/20.jpg', // Dummy image URL
      review: 'I love how this product has simplified my daily routine. Excellent design and performance!',
      rating: 4,
    },
    {
      id: 3,
      name: 'David Williams',
      image: 'https://randomuser.me/api/portraits/men/15.jpg', // Dummy image URL
      review: 'Good value for the price. It does what it promises, but I would love to see some improvements in speed.',
      rating: 3,
    },
  ];



 
  