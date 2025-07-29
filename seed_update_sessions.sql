UPDATE "Session"
SET "ip" = '0.0.0.0',
    "userAgent" = 'legacy-session'
WHERE "ip" IS NULL OR "userAgent" IS NULL;
