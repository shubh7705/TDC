import { fakerEN_IN as faker } from '@faker-js/faker';
try {
  console.log(faker.person.firstName('male'));
  console.log('Faker works');
} catch (e) {
  console.error(e);
}
