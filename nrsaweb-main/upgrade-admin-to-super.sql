-- Upgrade existing admin to super-admin with protection
UPDATE admins 
SET role = 'super-admin', protected = true 
WHERE email = 'admin@nrsa.com.ng' OR id = 1;