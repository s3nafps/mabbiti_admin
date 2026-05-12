# MABBITI Security Specification

## Data Invariants
1. Only users with `role: "admin"` or `role: "moderator"` can write to `establishments` and `categories`.
2. A review must have a valid `establishmentId` and `userId`.
3. Users cannot change their own roles in `users/{userId}`.
4. Analytics (`analytics/*`) are read-only for admins and written by the system (incremented).
5. Passwords and sensitive data are managed by Firebase Auth; public profiles only in Firestore.

## The "Dirty Dozen" (Target Payloads to Reject)
1. **Unauthenticated Write**: Attempting to create an establishment without a token.
2. **Identity Spoofing**: User A trying to delete User B's review.
3. **Privilege Escalation**: Non-admin user trying to update their role to "admin".
4. **Data Poisoning**: Injecting a 2MB string into `establishment.title`.
5. **Orphaned Review**: Creating a review for an establishment that doesn't exist.
6. **Self-Verification**: User trying to "approve" their own review.
7. **Bypassing Invariants**: Creating an establishment without a required `categoryId`.
8. **Shadow Field Injection**: Adding `isVerified: true` to a user profile that isn't in the schema.
9. **Spamming Analytics**: Trying to manually set `visits` count to 1,000,000.
10. **State Skipping**: Trying to transition a review from "pending" to "approved" as a non-moderator.
11. **Resource Exhaustion**: Creating an establishment with a very long ID string.
12. **PII Breach**: A regular user trying to list all emails in the `users` collection.

## Red Team Audit Plan
1. Test role-based access for all collections.
2. Verify immutability of `createdAt` and `ownerId`.
3. Ensure no blanket reads on `users`.
