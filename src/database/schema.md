# SparX Card Database Schema

This document describes the database schema for the SparX Card application. The schema is designed to be compatible with PostgreSQL, Firebase, Supabase, and local storage.

## Tables/Collections

### business_cards

Stores information about business cards.

| Column/Field | Type | Description |
|--------------|------|-------------|
| id | string | Unique identifier for the card |
| name | string | Name on the business card |
| title | string | Job title |
| company | string | Company name |
| phone | string | Primary phone number |
| email | string | Primary email address |
| website | string | Primary website URL |
| notes | string | Additional notes about the contact |
| user_id | string | ID of the user who owns this card |
| team_id | string | ID of the team this card belongs to (optional) |
| created_at | timestamp | When the card was created |
| updated_at | timestamp | When the card was last updated |
| additional_phones | string[] | Additional phone numbers |
| additional_emails | string[] | Additional email addresses |
| additional_websites | string[] | Additional website URLs |
| social_profiles | object | Social media profiles (key-value pairs) |
| language | string | Language code for the card content |

### teams

Stores information about teams.

| Column/Field | Type | Description |
|--------------|------|-------------|
| id | string | Unique identifier for the team |
| name | string | Team name |
| description | string | Team description |
| owner_id | string | ID of the team owner |
| created_at | timestamp | When the team was created |
| updated_at | timestamp | When the team was last updated |
| settings | object | Team settings (key-value pairs) |

### team_members

Stores information about team members.

| Column/Field | Type | Description |
|--------------|------|-------------|
| id | string | Unique identifier for the team member |
| team_id | string | ID of the team |
| user_id | string | ID of the user |
| role | string | Role in the team (Admin, Editor, Viewer) |
| active | boolean | Whether the member is active |
| created_at | timestamp | When the member was added |
| updated_at | timestamp | When the member was last updated |

### card_views

Stores information about card views for analytics.

| Column/Field | Type | Description |
|--------------|------|-------------|
| id | string | Unique identifier for the view |
| card_id | string | ID of the viewed card |
| ip_address | string | IP address of the viewer (hashed for privacy) |
| user_agent | string | User agent of the viewer |
| referrer | string | Referrer URL |
| country | string | Country of the viewer |
| city | string | City of the viewer |
| timestamp | timestamp | When the view occurred |
| device_id | string | Unique identifier for the device (for local views) |

## Indexes

### PostgreSQL

```sql
-- business_cards indexes
CREATE INDEX idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX idx_business_cards_team_id ON business_cards(team_id);
CREATE INDEX idx_business_cards_updated_at ON business_cards(updated_at DESC);

-- team_members indexes
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- card_views indexes
CREATE INDEX idx_card_views_card_id ON card_views(card_id);
CREATE INDEX idx_card_views_timestamp ON card_views(timestamp DESC);
```

### Firebase/Supabase

For Firebase and Supabase, we'll create composite indexes for common queries:

- business_cards: user_id, updated_at DESC
- business_cards: team_id, updated_at DESC
- team_members: team_id, role
- card_views: card_id, timestamp DESC

## Relationships

- A user can have many business cards (one-to-many)
- A team can have many business cards (one-to-many)
- A team can have many team members (one-to-many)
- A business card can have many views (one-to-many)

## Data Migration

When switching between database providers, the application will:

1. Export data from the current provider
2. Transform the data to match the target provider's format if needed
3. Import the data into the target provider
4. Verify the data integrity after migration

## Local Storage Structure

For local storage, data is stored in AsyncStorage with the following keys:

- `sparx_business_cards`: Array of business card objects
- `sparx_teams`: Array of team objects
- `sparx_team_members_[team_id]`: Array of team member objects for a specific team
- `sparx_card_views_[card_id]`: Array of view objects for a specific card

## Security Considerations

- For PostgreSQL, use prepared statements to prevent SQL injection
- For Firebase/Supabase, use security rules to restrict access
- For local storage, optionally encrypt sensitive data
- Always validate input data before storing it
- Implement proper authentication and authorization checks