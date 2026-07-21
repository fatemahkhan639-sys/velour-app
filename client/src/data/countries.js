// List of countries with ISO codes and postal code validation patterns
export const countries = [
  { name: "Afghanistan", code: "AF", postalRegex: null },
  { name: "Australia", code: "AU", postalRegex: /^\d{4}$/ },
  { name: "Austria", code: "AT", postalRegex: /^\d{4}$/ },
  { name: "Bangladesh", code: "BD", postalRegex: /^\d{4}$/ },
  { name: "Belgium", code: "BE", postalRegex: /^\d{4}$/ },
  { name: "Brazil", code: "BR", postalRegex: /^\d{5}-?\d{3}$/ },
  { name: "Canada", code: "CA", postalRegex: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/ },
  { name: "China", code: "CN", postalRegex: /^\d{6}$/ },
  { name: "Denmark", code: "DK", postalRegex: /^\d{4}$/ },
  { name: "Egypt", code: "EG", postalRegex: /^\d{5}$/ },
  { name: "Finland", code: "FI", postalRegex: /^\d{5}$/ },
  { name: "France", code: "FR", postalRegex: /^\d{5}$/ },
  { name: "Germany", code: "DE", postalRegex: /^\d{5}$/ },
  { name: "India", code: "IN", postalRegex: /^\d{6}$/ },
  { name: "Indonesia", code: "ID", postalRegex: /^\d{5}$/ },
  { name: "Ireland", code: "IE", postalRegex: null },
  { name: "Italy", code: "IT", postalRegex: /^\d{5}$/ },
  { name: "Japan", code: "JP", postalRegex: /^\d{3}-?\d{4}$/ },
  { name: "Malaysia", code: "MY", postalRegex: /^\d{5}$/ },
  { name: "Mexico", code: "MX", postalRegex: /^\d{5}$/ },
  { name: "Netherlands", code: "NL", postalRegex: /^\d{4} ?[A-Za-z]{2}$/ },
  { name: "New Zealand", code: "NZ", postalRegex: /^\d{4}$/ },
  { name: "Nigeria", code: "NG", postalRegex: /^\d{6}$/ },
  { name: "Norway", code: "NO", postalRegex: /^\d{4}$/ },
  { name: "Pakistan", code: "PK", postalRegex: /^\d{5}$/ },
  { name: "Philippines", code: "PH", postalRegex: /^\d{4}$/ },
  { name: "Poland", code: "PL", postalRegex: /^\d{2}-\d{3}$/ },
  { name: "Portugal", code: "PT", postalRegex: /^\d{4}-\d{3}$/ },
  { name: "Russia", code: "RU", postalRegex: /^\d{6}$/ },
  { name: "Saudi Arabia", code: "SA", postalRegex: /^\d{5}$/ },
  { name: "Singapore", code: "SG", postalRegex: /^\d{6}$/ },
  { name: "South Africa", code: "ZA", postalRegex: /^\d{4}$/ },
  { name: "South Korea", code: "KR", postalRegex: /^\d{5}$/ },
  { name: "Spain", code: "ES", postalRegex: /^\d{5}$/ },
  { name: "Sri Lanka", code: "LK", postalRegex: /^\d{5}$/ },
  { name: "Sweden", code: "SE", postalRegex: /^\d{3} ?\d{2}$/ },
  { name: "Switzerland", code: "CH", postalRegex: /^\d{4}$/ },
  { name: "Thailand", code: "TH", postalRegex: /^\d{5}$/ },
  { name: "Turkey", code: "TR", postalRegex: /^\d{5}$/ },
  { name: "United Arab Emirates", code: "AE", postalRegex: null },
  { name: "United Kingdom", code: "GB", postalRegex: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/ },
  { name: "United States", code: "US", postalRegex: /^\d{5}(-\d{4})?$/ },
];

// Validate a postal code against a country's expected format
export const validatePostalCode = (countryName, postalCode) => {
  const country = countries.find((c) => c.name === countryName);
  if (!country) return true; // unknown country, skip validation
  if (!country.postalRegex) return true; // no strict format for this country
  return country.postalRegex.test(postalCode.trim());
};