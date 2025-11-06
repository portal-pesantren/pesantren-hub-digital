# Session Management System

This comprehensive session management system provides robust authentication, token refresh, security features, and excellent user experience for the pesantren-hub-digital application.

## Features

### 1. Token Refresh Mechanism
- **Automatic token refresh** before expiration (5 minutes buffer)
- **Silent refresh** without user interruption
- **Concurrent request queuing** during refresh operations
- **Fallback handling** when refresh fails
- **Rate limiting** for refresh attempts

### 2. Session Expiration Handling
- **Graceful session timeout** handling (30 minutes of inactivity)
- **User notifications** before session expires (5 minutes warning)
- **Automatic logout** and redirect to login
- **Remember me functionality** (30 days)

### 3. Session State Management
- **Global session state** tracking
- **Activity monitoring** (mouse, keyboard, scroll, focus)
- **Idle timeout detection**
- **Multiple tab/session synchronization**

### 4. Security Features
- **Token validation** on each request
- **CSRF protection** implementation
- **Rate limiting** for API calls
- **Secure token storage** with device fingerprinting
- **Device validation** for session security

### 5. User Experience
- **Seamless re-authentication**
- **Progress indicators** for session renewal
- **Offline support** with request queuing
- **Session recovery** after network issues
- **Real-time session status** indicators

## Architecture

### Core Services

#### SessionService (`src/services/sessionService.ts`)
- Central session management
- Token refresh logic
- Activity monitoring
- Session state tracking

#### APIClient (`src/services/apiClient.ts`)
- HTTP client with interceptors
- Automatic token refresh integration
- Request caching and deduplication
- Error handling and retry logic

#### OfflineService (`src/services/offlineService.ts`)
- Offline request queuing
- Request synchronization
- IndexedDB storage for large data
- Network status monitoring

#### ErrorHandlingService (`src/services/errorHandlingService.ts`)
- Centralized error logging
- Error categorization and reporting
- Debug information collection
- Performance monitoring

### React Hooks

#### useSession
```typescript
const {
  session,
  isValid,
  isExpired,
  timeRemaining,
  refresh,
  extend
} = useSession({
  listenToEvents: true,
  autoRefresh: true,
  showWarnings: true,
  checkInterval: 1000
});
```

#### useSessionTimeout
```typescript
const {
  timeRemaining,
  isWarning,
  isTimeout,
  extend,
  dismissWarning
} = useSessionTimeout({
  warningTime: 5 * 60 * 1000,
  onWarning: (time) => console.log('Session warning:', time),
  onTimeout: () => console.log('Session timeout'),
  enabled: true
});
```

#### useActivityTracking
```typescript
const {
  activityCount,
  lastActivity,
  recordActivity
} = useActivityTracking({
  trackPageViews: true,
  trackClicks: true,
  trackScrolls: false,
  debounceTime: 1000
});
```

### UI Components

#### SessionManager
Main orchestrator component that manages all session UI:
```typescript
<SessionManager
  showWarning={true}
  showStatus={true}
  statusPosition="header"
  warningTime={5 * 60 * 1000}
  statusCompact={false}
/>
```

#### SessionWarningDialog
Shows warning when session is about to expire:
```typescript
<SessionWarningDialog
  warningTime={5 * 60 * 1000}
  enabled={true}
  onExtend={() => console.log('Session extended')}
  onLogout={() => console.log('User logged out')}
/>
```

#### SessionStatusIndicator
Real-time session status display:
```typescript
<SessionStatusIndicator
  showDetails={true}
  position="header"
  compact={false}
/>
```

## Usage Examples

### Basic Setup

1. **Update your AuthProvider** to include session management:

```typescript
// App.tsx or root component
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider
      sessionConfig={{
        accessTokenLifetime: 15 * 60 * 1000, // 15 minutes
        sessionTimeout: 30 * 60 * 1000,      // 30 minutes
        showWarnings: true,
        autoLogout: true
      }}
      apiConfig={{
        baseURL: process.env.VITE_API_BASE_URL,
        defaultHeaders: {
          'Content-Type': 'application/json'
        }
      }}
    >
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

2. **Add SessionManager** to your layout:

```typescript
// DashboardLayout.tsx
import { SessionManager } from '@/components/session';

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <header>
        <SessionManager
          showStatus={true}
          statusPosition="header"
        />
        {/* Other header content */}
      </header>

      <main>
        {/* Main content */}
      </main>
    </div>
  );
}
```

3. **Use session hooks in components**:

```typescript
// ProfilePage.tsx
import { useSession, useAuth } from '@/hooks';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { timeRemaining, extend, refresh } = useSession();

  const handleProfileUpdate = async (data) => {
    await updateProfile(data);
    // Session is automatically extended
  };

  const handleExtendSession = () => {
    extend();
  };

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Session expires in: {Math.floor(timeRemaining.activity / 60000)} minutes</p>
      <button onClick={handleExtendSession}>Extend Session</button>
    </div>
  );
}
```

### Advanced Usage

#### Custom API Client

```typescript
import { APIClient } from '@/services/apiClient';

const apiClient = APIClient.getInstance({
  baseURL: process.env.VITE_API_BASE_URL,
  defaultHeaders: {
    'X-Custom-Header': 'value'
  }
});

// Add custom interceptors
apiClient.addRequestInterceptor((config) => {
  // Modify request before sending
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Request-ID': generateRequestId()
    }
  };
});

apiClient.addResponseInterceptor((response) => {
  // Handle successful responses
  return response;
});

apiClient.addErrorInterceptor(async (error) => {
  // Handle errors globally
  if (error.status === 401) {
    // Handle unauthorized
  }
  throw error;
});
```

#### Offline Support

```typescript
import { OfflineService } from '@/services/offlineService';

const offlineService = OfflineService.getInstance();

// Listen for online/offline events
offlineService.on('online', () => {
  console.log('Back online - syncing requests');
});

offlineService.on('offline', () => {
  console.log('Gone offline - queuing requests');
});

// Queue a request for offline execution
const requestId = offlineService.queueRequest(
  '/api/profile',
  { method: 'PUT', body: profileData },
  'high'
);

// Sync queued requests
const result = await offlineService.syncRequests();
console.log(`Synced: ${result.synced}, Failed: ${result.failed}`);
```

#### Error Handling

```typescript
import { ErrorHandlingService } from '@/services/errorHandlingService';

const errorService = ErrorHandlingService.getInstance();

// Log different types of errors
errorService.auth('Login failed', 'error', { email, timestamp });
errorService.session('Token refresh failed', 'warn', { attempts: 3 });
errorService.api('Request failed', 'error', { url, status });

// Handle errors with retry
const result = await errorService.withRetry(
  () => apiClient.get('/api/data'),
  'fetch-data',
  'api',
  3 // max retries
);
```

## Configuration

### Session Configuration

```typescript
const sessionConfig: SessionConfig = {
  // Token timing (milliseconds)
  accessTokenLifetime: 15 * 60 * 1000,    // 15 minutes
  refreshTokenLifetime: 7 * 24 * 60 * 60 * 1000, // 7 days
  refreshBuffer: 5 * 60 * 1000,           // 5 minutes before expiry
  sessionTimeout: 30 * 60 * 1000,         // 30 minutes of inactivity
  warningTime: 5 * 60 * 1000,             // 5 minutes before timeout

  // Security settings
  maxRefreshAttempts: 3,                   // Maximum retry attempts
  refreshCooldown: 30 * 1000,              // 30 seconds between attempts
  csrfProtection: true,                    // Enable CSRF protection
  rateLimitEnabled: true,                  // Enable rate limiting

  // User experience
  showWarnings: true,                      // Show timeout warnings
  autoLogout: true,                        // Auto-logout on timeout
  rememberMeDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
};
```

### API Client Configuration

```typescript
const apiConfig = {
  baseURL: process.env.VITE_API_BASE_URL,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
```

### Error Handling Configuration

```typescript
const errorConfig: ErrorHandlingConfig = {
  enableLogging: true,                     // Enable error logging
  enableReporting: false,                  // Enable external reporting
  logLevel: 'info',                        // Minimum log level
  maxLogEntries: 1000,                     // Maximum log entries
  reportInterval: 5 * 60 * 1000,           // Reporting interval
  enableUserFeedback: true,                // Enable user feedback
  enableRetry: true,                       // Enable retry logic
  maxRetries: 3,                          // Maximum retry attempts
  retryDelay: 1000,                        // Base retry delay
};
```

## Security Considerations

### Token Security
- Tokens are stored in localStorage with device fingerprinting
- Access tokens have short lifetime (15 minutes)
- Refresh tokens are used only for token renewal
- Automatic token cleanup on logout

### Session Security
- Device fingerprinting prevents session hijacking
- Activity monitoring detects session anomalies
- Rate limiting prevents brute force attacks
- CSRF protection for state-changing requests

### Network Security
- All requests use HTTPS in production
- Request/response interceptors validate data
- Error information is sanitized for logging
- Sensitive data is never logged

## Performance Optimization

### Request Optimization
- Request deduplication prevents duplicate calls
- Response caching reduces server load
- Concurrent request handling improves efficiency
- Intelligent retry logic handles network issues

### Memory Management
- Log entry limits prevent memory leaks
- Automatic cleanup of expired data
- Event listener cleanup on component unmount
- Efficient data structures for state management

### Network Optimization
- Request queuing for offline scenarios
- Batch operations for multiple requests
- Progressive data loading
- Optimized payload sizes

## Troubleshooting

### Common Issues

1. **Session expires too frequently**
   - Check session timeout configuration
   - Verify activity monitoring is working
   - Check for network connectivity issues

2. **Token refresh fails**
   - Verify refresh token is valid
   - Check refresh token endpoint
   - Ensure CSRF protection is configured

3. **Offline requests not syncing**
   - Verify network connectivity
   - Check IndexedDB availability
   - Review queued request data

4. **Memory leaks**
   - Ensure event listeners are cleaned up
   - Check for infinite loops in activity tracking
   - Monitor log entry growth

### Debug Tools

The system includes debug information in development mode:
- Session state indicators
- Error log viewer
- Network status monitoring
- Performance metrics

Enable debug mode by setting `NODE_ENV=development`.

## Migration Guide

To migrate from the basic authentication system:

1. **Update AuthProvider** with new session configuration
2. **Add SessionManager** to your layout
3. **Replace API calls** with the new APIClient
4. **Update error handling** to use ErrorHandlingService
5. **Add offline support** where needed
6. **Test session timeout** scenarios
7. **Verify security features** are working

## Best Practices

1. **Always use the APIClient** for HTTP requests
2. **Handle session events** appropriately
3. **Implement proper error boundaries**
4. **Test offline scenarios** thoroughly
5. **Monitor session performance** in production
6. **Keep token lifetimes** short and secure
7. **Use proper TypeScript types** for all components
8. **Implement proper cleanup** in useEffect hooks

## Support

For issues, questions, or contributions:
1. Check the existing documentation
2. Review the troubleshooting section
3. Check the GitHub issues
4. Contact the development team

This session management system provides enterprise-grade security and user experience while maintaining excellent performance and reliability.