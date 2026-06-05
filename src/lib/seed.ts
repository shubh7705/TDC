import { collection, addDoc, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { fakerEN_IN as faker } from '@faker-js/faker';

const DEMO_MATCHMAKER_ID = 'demo-matchmaker-id'; // Replaced by actual uid after auth, or hardcoded for demo

const INDIAN_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur'];
const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];
const LANGUAGES = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Punjabi'];

const getRandomElements = (arr: any[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateProfile = (gender: 'Male' | 'Female', isMatchPool = false) => {
  const age = faker.number.int({ min: 22, max: 35 });
  const height = faker.number.int({ min: 150, max: 190 });
  const income = faker.number.int({ min: 500000, max: 5000000 });
  
  return {
    matchmakerId: DEMO_MATCHMAKER_ID,
    firstName: faker.person.firstName(gender.toLowerCase() as 'male' | 'female'),
    lastName: faker.person.lastName(),
    gender,
    dob: faker.date.birthdate({ min: 22, max: 35, mode: 'age' }).toISOString(),
    age,
    country: 'India',
    city: faker.helpers.arrayElement(INDIAN_CITIES),
    height,
    weight: faker.number.int({ min: 50, max: 90 }),
    
    email: faker.internet.email(),
    phone: faker.phone.number(),
    
    undergraduateCollege: `${faker.location.city()} University`,
    degree: faker.helpers.arrayElement(['B.Tech', 'B.Sc', 'B.Com', 'B.A.', 'BBA']),
    postgraduateDegree: faker.helpers.maybe(() => faker.helpers.arrayElement(['MBA', 'M.Tech', 'M.Sc']), { probability: 0.4 }) || null,
    
    currentCompany: faker.company.name(),
    designation: faker.person.jobTitle(),
    income,
    industry: faker.person.jobArea(),
    
    siblings: faker.number.int({ min: 0, max: 3 }),
    familyType: faker.helpers.arrayElement(['Nuclear', 'Joint', 'Other']),
    familyValues: faker.helpers.arrayElement(['Orthodox', 'Traditional', 'Moderate', 'Liberal']),
    
    religion: faker.helpers.arrayElement(RELIGIONS),
    caste: 'General',
    motherTongue: faker.helpers.arrayElement(LANGUAGES),
    languagesKnown: getRandomElements(LANGUAGES, faker.number.int({ min: 1, max: 3 })),
    manglik: faker.helpers.arrayElement(['Yes', 'No', 'Anshik', 'Not Applicable']),
    
    diet: faker.helpers.arrayElement(['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan']),
    smoking: faker.helpers.arrayElement(['No', 'Occasionally', 'Yes']),
    drinking: faker.helpers.arrayElement(['No', 'Occasionally', 'Yes']),
    hobbies: [faker.word.verb(), faker.word.noun()],
    fitnessLevel: faker.helpers.arrayElement(['Sedentary', 'Active', 'Very Active']),
    
    wantKids: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
    openToRelocate: faker.datatype.boolean(),
    openToPets: faker.datatype.boolean(),
    
    partnerAgeRange: [age - 3, age + 3],
    partnerHeightRange: [height - 10, height + 10],
    partnerCities: getRandomElements(INDIAN_CITIES, 3),
    partnerReligion: [faker.helpers.arrayElement(RELIGIONS)],
    partnerEducation: ['B.Tech', 'MBA'],
    
    status: isMatchPool ? 'Profile Review' : faker.helpers.arrayElement(['Needs Match', 'Profile Review', 'Verified', 'Match Sent']),
    matchCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const runSeed = async (userUid: string) => {
  // Check if we already seeded for this user
  const q = query(collection(db, 'customers'), where('matchmakerId', '==', userUid));
  const snapshot = await getDocs(q);
  if (snapshot.size > 20) {
    console.log("Database already seeded");
    return;
  }

  console.log("Starting seed process...");

  // Generate 20 Active Customers (mix of male/female)
  for (let i = 0; i < 20; i++) {
    const profile = generateProfile(faker.helpers.arrayElement(['Male', 'Female']));
    profile.matchmakerId = userUid;
    await addDoc(collection(db, 'customers'), profile);
  }

  // Generate 100 Match Pool profiles
  for (let i = 0; i < 100; i++) {
    const profile = generateProfile(faker.helpers.arrayElement(['Male', 'Female']), true);
    profile.matchmakerId = userUid;
    await addDoc(collection(db, 'customers'), profile);
  }

  console.log("Seed process completed successfully.");
};
