'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ExchangeRate {
  currency: string;
  name: { fr: string; ar: string };
  rate: number;
  flag: string;
}

interface CurrencyConverterProps {
  currentLanguage: 'fr' | 'ar';
}

const CurrencyConverter = ({ currentLanguage }: CurrencyConverterProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<string>('DZD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mock exchange rates (in production, fetch from ExchangeRate-API)
  const exchangeRates: ExchangeRate[] = [
    {
      currency: 'DZD',
      name: { fr: 'Dinar Algérien', ar: 'الدينار الجزائري' },
      rate: 1,
      flag: '🇩🇿'
    },
    {
      currency: 'EUR',
      name: { fr: 'Euro', ar: 'اليورو' },
      rate: 0.0074,
      flag: '🇪🇺'
    },
    {
      currency: 'USD',
      name: { fr: 'Dollar Américain', ar: 'الدولار الأمريكي' },
      rate: 0.0075,
      flag: '🇺🇸'
    },
    {
      currency: 'GBP',
      name: { fr: 'Livre Sterling', ar: 'الجنيه الإسترليني' },
      rate: 0.0059,
      flag: '🇬🇧'
    },
    {
      currency: 'CAD',
      name: { fr: 'Dollar Canadien', ar: 'الدولار الكندي' },
      rate: 0.010,
      flag: '🇨🇦'
    }
  ];

  const content = {
    fr: {
      title: "Convertisseur de Devises",
      subtitle: "Convertissez facilement vos dinars",
      amount: "Montant",
      from: "De",
      to: "Vers",
      convert: "Convertir",
      result: "Résultat",
      lastUpdated: "Dernière mise à jour"
    },
    ar: {
      title: "محول العملات",
      subtitle: "حول دنانيرك بسهولة",
      amount: "المبلغ",
      from: "من",
      to: "إلى",
      convert: "تحويل",
      result: "النتيجة",
      lastUpdated: "آخر تحديث"
    }
  };

  const handleConvert = () => {
    if (!isHydrated) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const fromRate = exchangeRates.find(rate => rate.currency === fromCurrency)?.rate || 1;
      const toRate = exchangeRates.find(rate => rate.currency === toCurrency)?.rate || 1;
      
      const numAmount = parseFloat(amount) || 0;
      const result = (numAmount / fromRate) * toRate;
      
      setConvertedAmount(result);
      setIsLoading(false);
    }, 500);
  };

  const formatCurrency = (value: number, currency: string) => {
    if (!isHydrated) return '0';
    
    return new Intl.NumberFormat(currentLanguage === 'fr' ? 'fr-DZ' : 'ar-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'DZD' ? 0 : 2,
      maximumFractionDigits: currency === 'DZD' ? 0 : 4
    }).format(value);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setConvertedAmount(0);
  };

  if (!isHydrated) {
    return (
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-xl p-8 shadow-elevation-1">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card border border-border rounded-xl p-8 shadow-elevation-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {content[currentLanguage].title}
            </h2>
            <p className="text-text-secondary">
              {content[currentLanguage].subtitle}
            </p>
          </div>

          {/* Converter Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {content[currentLanguage].amount}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                  placeholder="0.00"
                />
                <Icon 
                  name="CurrencyDollarIcon" 
                  size={20} 
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
              </div>
            </div>

            {/* From Currency */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {content[currentLanguage].from}
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none bg-input"
              >
                {exchangeRates.map((rate) => (
                  <option key={rate.currency} value={rate.currency}>
                    {rate.flag} {rate.currency} - {rate.name[currentLanguage]}
                  </option>
                ))}
              </select>
            </div>

            {/* To Currency */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {content[currentLanguage].to}
              </label>
              <div className="flex gap-2">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="flex-1 px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth appearance-none bg-input"
                >
                  {exchangeRates.map((rate) => (
                    <option key={rate.currency} value={rate.currency}>
                      {rate.flag} {rate.currency} - {rate.name[currentLanguage]}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={swapCurrencies}
                  className="p-3 border border-border rounded-lg hover:bg-muted transition-smooth"
                  title={currentLanguage === 'fr' ? 'Échanger les devises' : 'تبديل العملات'}
                >
                  <Icon name="ArrowsRightLeftIcon" size={20} className="text-text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleConvert}
              disabled={isLoading || !amount}
              className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              {isLoading ? (
                <>
                  <Icon name="ArrowPathIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
                  {currentLanguage === 'fr' ? 'Conversion...' : 'جاري التحويل...'}
                </>
              ) : (
                <>
                  <Icon name="CalculatorIcon" size={20} className="mr-2 rtl:mr-0 rtl:ml-2" />
                  {content[currentLanguage].convert}
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {convertedAmount > 0 && (
            <div className="bg-muted rounded-lg p-6 text-center">
              <div className="text-sm text-text-secondary mb-2">
                {content[currentLanguage].result}
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(convertedAmount, toCurrency)}
              </div>
              <div className="text-sm text-text-secondary">
                {formatCurrency(parseFloat(amount) || 0, fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
              </div>
            </div>
          )}

          {/* Exchange Rates Display */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="text-sm text-text-secondary text-center mb-4">
              {content[currentLanguage].lastUpdated}: {new Date().toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'ar-DZ')}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exchangeRates.filter(rate => rate.currency !== 'DZD').map((rate) => (
                <div key={rate.currency} className="text-center p-3 bg-background rounded-lg">
                  <div className="text-lg mb-1">{rate.flag}</div>
                  <div className="text-sm font-medium text-text-primary">
                    1 {rate.currency}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatCurrency(1 / rate.rate, 'DZD')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyConverter;