'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  userAvatarAlt: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface CustomerReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  currentLanguage: 'fr' | 'ar';
  onSubmitReview: (review: { rating: number; title: string; comment: string }) => void;
}

const CustomerReviews = ({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
  currentLanguage,
  onSubmitReview
}: CustomerReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="StarIcon"
          size={size}
          variant={i <= rating ? 'solid' : 'outline'}
          className={i <= rating ? 'text-accent' : 'text-muted'}
        />
      );
    }
    return stars;
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(newReview);
    setNewReview({ rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'ar-DZ');
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {currentLanguage === 'fr' ? 'Avis clients' : 'آراء العملاء'}
          </h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-smooth flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Icon name="PencilIcon" size={16} />
            <span>
              {currentLanguage === 'fr' ? 'Écrire un avis' : 'اكتب تقييماً'}
            </span>
          </button>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="text-center md:text-left rtl:md:text-right">
            <div className="flex items-center justify-center md:justify-start rtl:md:justify-end space-x-2 rtl:space-x-reverse mb-2">
              <span className="text-4xl font-bold text-text-primary">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {renderStars(Math.round(averageRating), 20)}
              </div>
            </div>
            <p className="text-text-secondary">
              {currentLanguage === 'fr' 
                ? `Basé sur ${totalReviews} avis` 
                : `بناءً على ${totalReviews} تقييم`}
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm text-text-secondary w-8">
                  {rating} ★
                </span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-text-secondary w-8">
                  {ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="p-6 border-b border-border bg-muted/50">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Note' : 'التقييم'}
              </label>
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                    className="p-1"
                  >
                    <Icon
                      name="StarIcon"
                      size={24}
                      variant={rating <= newReview.rating ? 'solid' : 'outline'}
                      className={rating <= newReview.rating ? 'text-accent' : 'text-muted'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Titre de l\'avis' : 'عنوان التقييم'}
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={currentLanguage === 'fr' ? 'Résumez votre expérience...' : 'لخص تجربتك...'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {currentLanguage === 'fr' ? 'Votre avis' : 'رأيك'}
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder={currentLanguage === 'fr' ? 'Partagez votre expérience avec ce produit...' : 'شارك تجربتك مع هذا المنتج...'}
                required
              />
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Publier l\'avis' : 'نشر التقييم'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="border border-border px-6 py-2 rounded-lg font-medium hover:bg-muted transition-smooth"
              >
                {currentLanguage === 'fr' ? 'Annuler' : 'إلغاء'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <div key={review.id} className="p-6">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <AppImage
                  src={review.userAvatar}
                  alt={review.userAvatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <h4 className="font-medium text-text-primary">{review.userName}</h4>
                      {review.verified && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse text-success">
                          <Icon name="CheckBadgeIcon" size={16} />
                          <span className="text-xs">
                            {currentLanguage === 'fr' ? 'Achat vérifié' : 'شراء موثق'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-text-primary mb-2">{review.title}</h5>
                  <p className="text-text-secondary leading-relaxed">{review.comment}</p>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <button className="flex items-center space-x-1 rtl:space-x-reverse text-sm text-text-secondary hover:text-primary transition-smooth">
                    <Icon name="HandThumbUpIcon" size={16} />
                    <span>
                      {currentLanguage === 'fr' ? 'Utile' : 'مفيد'} ({review.helpful})
                    </span>
                  </button>
                  <button className="text-sm text-text-secondary hover:text-primary transition-smooth">
                    {currentLanguage === 'fr' ? 'Signaler' : 'إبلاغ'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="ChatBubbleLeftEllipsisIcon" size={48} className="text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {currentLanguage === 'fr' ? 'Aucun avis pour le moment' : 'لا توجد تقييمات حتى الآن'}
          </h3>
          <p className="text-text-secondary">
            {currentLanguage === 'fr' ?'Soyez le premier à laisser un avis sur ce produit.' :'كن أول من يترك تقييماً لهذا المنتج.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;