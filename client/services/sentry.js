import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: 'https://d61c17173a154aa68b19c44386ab04e6@sentry.io/1852699',
    enableInExpoDevelopment: true,
    debug: true
});