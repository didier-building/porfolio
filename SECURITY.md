# 🔒 Security Guidelines

## ⚠️ CRITICAL SECURITY NOTICE

**NEVER commit sensitive data to version control!**

## 🚨 Sensitive Data That Must NEVER Be Committed

### Environment Files
- `.env`
- `.env.local`
- `.env.production`
- Any file containing API keys, passwords, or secrets

### API Keys & Secrets
- Google Gemini API keys
- OpenAI API keys
- Database passwords
- Secret keys
- Authentication tokens
- Cloudflare Turnstile secrets

### Personal Documents
- CVs, resumes, certificates
- Cover letters
- Personal identification documents
- Any documents in `media/career_documents/`

### Database Files
- `db.sqlite3`
- Database dumps
- Any `.db` files

### Log Files
- `*.log`
- Debug logs containing sensitive information

## ✅ Security Best Practices

### 1. Environment Variables
```bash
# ✅ Good - Use environment variables
SECRET_KEY = os.getenv('SECRET_KEY')
API_KEY = os.getenv('GOOGLE_GEMINI_API_KEY')

# ❌ Bad - Hardcoded secrets
SECRET_KEY = 'hardcoded-secret-key'
API_KEY = 'AIzaSy...'
```

### 2. API Key Management
- **Generate your own API keys** - never use shared keys
- **Regenerate keys** if accidentally exposed
- **Use different keys** for development and production
- **Set up key rotation** for production environments

### 3. Database Security
- Use strong passwords for production databases
- Enable SSL/TLS for database connections
- Regular backups with encryption
- Limit database access by IP

### 4. File Permissions
```bash
# Set secure permissions for sensitive files
chmod 600 .env
chmod 600 *.key
chmod 600 *.pem
```

### 5. Production Security
- Set `DEBUG=False` in production
- Use HTTPS only
- Configure proper CORS settings
- Enable security headers
- Regular security updates

## 🛡️ Security Headers Configuration

Add these to your production settings:

```python
# Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## 🔍 Security Checklist

### Before Deployment
- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] API keys are environment variables
- [ ] Database credentials are secure
- [ ] Debug mode is disabled in production
- [ ] HTTPS is configured
- [ ] Security headers are enabled
- [ ] Dependencies are up to date

### Regular Security Maintenance
- [ ] Rotate API keys quarterly
- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Backup data regularly
- [ ] Monitor for security vulnerabilities

## 🚨 If You Accidentally Commit Secrets

### Immediate Actions
1. **Regenerate the exposed secrets immediately**
2. **Remove from Git history** (if possible)
3. **Update all systems** using the old secrets
4. **Review access logs** for unauthorized usage
5. **Notify team members** if applicable

### Git History Cleanup
```bash
# Remove sensitive file from Git history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/sensitive/file' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (⚠️ dangerous - coordinate with team)
git push origin --force --all
```

## 📞 Security Contact

If you discover a security vulnerability:
1. **Do NOT** create a public issue
2. Contact the maintainer privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be fixed before disclosure

## 🔗 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/topics/security/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Google API Security](https://cloud.google.com/docs/security)

---

**Remember: Security is everyone's responsibility!** 🛡️
