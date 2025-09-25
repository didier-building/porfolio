# Contact Form Email Setup

## ✅ What's Done
- Backend API endpoint: `POST /api/contact/`
- Frontend form updated to use backend API
- Email sending configured with Gmail SMTP
- Rate limiting (5 messages per minute per IP)
- Honeypot spam protection
- Message storage in database

## 📧 Email Configuration

### Step 1: Gmail App Password
1. Enable 2-Factor Authentication on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and generate an app password
4. Copy the 16-character password (no spaces)

### Step 2: Environment Variables
Create/update `.env` file in `backend/portfolio_backend/`:

```bash
# Email Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=didier53053@gmail.com
```

### Step 3: Test Email Setup
```bash
cd backend/portfolio_backend
uv run python test_email.py
```

## 🧪 Testing

### Test API Endpoint
```bash
# Start backend server
cd backend/portfolio_backend
uv run manage.py runserver

# Test contact form (in another terminal)
python test_contact.py
```

### Test Frontend Integration
1. Start backend: `uv run manage.py runserver`
2. Start frontend: `npm run dev`
3. Fill out contact form on website
4. Check email inbox and database

## 📋 How It Works

1. **Frontend**: User fills form → sends POST to `http://127.0.0.1:8000/api/contact/`
2. **Backend**: 
   - Validates data (honeypot, required fields)
   - Saves to database
   - Sends email to `ADMIN_EMAIL`
   - Returns success/error response
3. **Email**: You receive notification with sender details and message

## 🔧 Troubleshooting

### No Email Received
- Check spam folder
- Verify Gmail app password is correct
- Ensure 2FA is enabled on Gmail
- Check console for error messages

### API Errors
- Ensure backend server is running on port 8000
- Check CORS settings allow frontend domain
- Verify rate limiting (max 5 messages per minute)

### Frontend Issues
- Check browser console for errors
- Verify API URL is correct
- Test with browser dev tools network tab

## 🚀 Production Deployment

For production, update frontend API URL from:
```javascript
'http://127.0.0.1:8000/api/contact/'
```
to:
```javascript
'https://your-backend-domain.com/api/contact/'
```

## 📊 Message Management

View messages in Django admin:
```bash
uv run manage.py createsuperuser
uv run manage.py runserver
# Visit: http://127.0.0.1:8000/admin/
```

Messages are stored with:
- Name, email, message content
- Timestamp, IP address, user agent
- Status (new/read/replied/spam)
- Admin notes field