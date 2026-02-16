import { createInsertSchema } from 'drizzle-zod';
import { clubs } from './shared/schema.ts';

const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
});

console.log('Schema fields:', Object.keys(insertClubSchema.shape));

const testData = {
  name: 'Test Club',
  city: 'Lagos',
  state: 'Lagos',
  managerName: 'John Doe',
  contactEmail: 'test@test.com',
  contactPhone: '1234567890',
  isRegistered: true
};

try {
  const result = insertClubSchema.parse(testData);
  console.log('Parse SUCCESS:', result);
} catch (error) {
  console.log('Parse ERROR:', error.message);
}
