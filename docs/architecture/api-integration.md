# API Integration

A centralized API client will be used for all backend communication, with specific logic organized into service files.

Example Client: lib/apiClient.ts

```typescript
// Central fetch client with base URL and auth header injection
// ... (implementation from previous turn)
```

Example Service: lib/services/workService.ts

```typescript
import apiClient from '@/lib/apiClient';

interface Work { /* ... */ }

export const workService = {
  async getWorkById(id: string): Promise<Work> {
    return apiClient.request<Work>(`/works/${id}`);
  },
  // ... other functions
};
```
