export type Company = "gitbook" | "ticketswap" | "framer";

export type CompanyLogos = {
  desktop: React.ReactElement;
  mobile: React.ReactElement;
};

export type CompanyData = {
  company: Company;
  link: string;
  logo: CompanyLogos;
};
