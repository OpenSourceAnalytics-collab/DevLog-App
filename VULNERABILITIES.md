# Known Vulnerabilities

## Current Status

As of the latest audit, there are **13 moderate severity vulnerabilities** in development dependencies.

## Vulnerability Details

### Development Dependencies Only

All vulnerabilities are in **development dependencies** and do not affect production builds:

1. **ajv** (via eslint) - ReDoS vulnerability
   - Severity: Moderate
   - Affects: Development tooling only
   - Impact: None on production builds

2. **esbuild** (via vite) - Development server vulnerability
   - Severity: Moderate  
   - Affects: Development server only
   - Impact: None on production builds
   - Fix available: Update vite to v7.3.1+ (major version)

3. **eslint** and related packages - Multiple vulnerabilities
   - Severity: Moderate
   - Affects: Linting tooling only
   - Impact: None on production builds

## Production Dependencies

✅ **All production dependencies are secure**:
- react: ^18.2.0 ✅
- react-dom: ^18.2.0 ✅
- react-router-dom: ^6.20.0 ✅
- date-fns: ^2.30.0 ✅
- lucide-react: ^0.294.0 ✅

## Mitigation

### Current Mitigations

1. **Production builds are secure** - Vulnerabilities only affect dev tooling
2. **Security headers** - CSP and other headers protect against attacks
3. **Input validation** - All user inputs are validated and sanitized
4. **Secure storage** - Storage operations are validated

### Recommended Actions

1. **Monitor dependencies**:
   ```bash
   npm audit
   npm outdated
   ```

2. **Update when stable**:
   - Wait for stable releases of vite v7 before upgrading
   - Monitor eslint updates for ajv fixes

3. **Use Dependabot**:
   - Automatic dependency updates configured
   - See `.github/dependabot.yml`

## Risk Assessment

**Risk Level: LOW**

- Vulnerabilities are in dev dependencies only
- No impact on production builds
- No user data at risk
- Application security measures in place

## Next Steps

1. Monitor for updates to vulnerable packages
2. Test vite v7 when stable
3. Update eslint when ajv vulnerability is fixed upstream
4. Continue regular security audits

## Security Audit Commands

```bash
# Check vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Security check (moderate and above)
npm run security:check
```

## Last Updated

Security audit last run: $(date)
