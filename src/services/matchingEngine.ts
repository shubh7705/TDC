import type { Customer, MatchScoreBreakdown } from '@/types';

const calculateMaleMatch = (male: Customer, candidate: Customer): MatchScoreBreakdown => {
  // Logic tailored for a Male customer seeking a Female partner
  let age = 0;
  if (candidate.age >= male.partnerAgeRange[0] && candidate.age <= male.partnerAgeRange[1]) {
    age = 25;
  } else if (candidate.age < male.age) {
    age = 15; // Partial score if younger but outside specific range
  }

  let children = 0;
  if (candidate.wantKids === male.wantKids) children = 30;
  else if (candidate.wantKids === 'Maybe' || male.wantKids === 'Maybe') children = 15;

  let height = 0;
  if (candidate.height >= male.partnerHeightRange[0] && candidate.height <= male.partnerHeightRange[1]) {
    height = 15;
  } else if (candidate.height < male.height) {
    height = 10;
  }

  let income = 0;
  if (candidate.income <= male.income) income = 15;
  else income = 5;

  let religion = 0;
  if (male.partnerReligion?.includes(candidate.religion)) religion = 5;

  let language = 0;
  if (candidate.motherTongue === male.motherTongue) language = 10;
  else if (candidate.languagesKnown?.some(l => male.languagesKnown?.includes(l))) language = 5;

  return {
    age,
    children,
    height,
    income,
    religion,
    language,
    education: 0,
    lifestyle: 0,
    values: 0,
    career: 0,
    relocation: 0
  };
};

const calculateFemaleMatch = (female: Customer, candidate: Customer): MatchScoreBreakdown => {
  // Holistic compatibility model for Female customer seeking a Male partner
  let values = 0;
  if (female.familyValues === candidate.familyValues) values = 25;
  else values = 10;

  let children = 0;
  if (candidate.wantKids === female.wantKids) children = 25;
  else if (candidate.wantKids === 'Maybe' || female.wantKids === 'Maybe') children = 10;

  let career = 0;
  if (candidate.income >= female.income) career = 20;
  else career = 5;

  let lifestyle = 0;
  if (female.diet === candidate.diet) lifestyle += 5;
  if (female.smoking === candidate.smoking) lifestyle += 5;
  if (female.drinking === candidate.drinking) lifestyle += 5;

  let relocation = 0;
  if (candidate.city === female.city) relocation = 15;
  else if (female.openToRelocate || candidate.openToRelocate) relocation = 10;

  return {
    values,
    children,
    career,
    lifestyle,
    relocation,
    age: 0,
    height: 0,
    income: 0,
    religion: 0,
    language: 0,
    education: 0
  };
};

export const calculateMatchScore = (customer: Customer, candidate: Customer): { score: number, breakdown: MatchScoreBreakdown } => {
  // Reject same gender by default for this MVP context unless specified otherwise
  if (customer.gender === candidate.gender) {
    return { score: 0, breakdown: { age:0, children:0, height:0, income:0, religion:0, language:0, education:0, lifestyle:0, values:0, career:0, relocation:0 } };
  }

  const breakdown = customer.gender === 'Male' 
    ? calculateMaleMatch(customer, candidate)
    : calculateFemaleMatch(customer, candidate);

  const score = Object.values(breakdown).reduce((acc, val) => acc + val, 0);

  return { score, breakdown };
};
