Role: Senior Frontend Architect & Security Expert Task: Implement the Team Management System and Role-Based Access Control (RBAC). Architecture: Feature-Sliced Design (FSD).

Context: We have successfully built the operational core (Editor, QA, and Analytics). Now, we must transform AuraVision into a collaborative enterprise platform by implementing Team Management and RBAC, strictly inspired by V7 Darwin's organization structure.

Requirements:

User & Roles Entity (src/entities/user):

Define the User and Role types. Roles must include: Owner, Admin, Reviewer, and Annotator.

Implement a UserAvatar and RoleBadge component.

Team Management Feature (src/features/manage-team):

Invite System: A modal to invite new members via email and assign them a specific role (mapping to POST /api/v1/teams/invite from Postman).

Member List: A table to manage existing members, change their roles, or revoke access.

Access Control Logic (src/shared/lib/rbac):

Implement a high-order component (HOC) or a specialized hook usePermission to guard UI elements.

Example: Only Admin or Reviewer roles should see the "Approve/Reject" buttons in the Editor.

Organization Settings Widget (src/widgets/org-settings):

A settings panel for "General Settings", "API Keys" (for developer access), and "Authentication Logs".

Include a section for Security Compliance displaying SOC2 and HIPAA status placeholders.

API Integration (Shared Layer):

Map these from the Postman collection:

GET /api/v1/organization/members: To list team members.

PATCH /api/v1/users/{id}/role: To update user permissions.

GET /api/v1/organization/api-keys: To manage developer tokens.

UI/UX & Design:

Use a clean, "Bento-style" layout for settings cards.

Ensure a "Strategic Minimalism" feel: focus on high-security vibes with crisp typography and subtle "Glow Effects" for active states.

Instructions:

Analyze the Postman collection for "User", "Team", or "Role" related endpoints.

Start by creating the rbac logic in the shared layer.

Then, build the entities/user and features/manage-team.

Finally, assemble the Team Settings Page in src/pages/settings.