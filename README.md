1. ionic build --prod -- --base-href https://github.com/MilosKuzmanovic/MFW
2. ng run app:build:production --base-href https://github.com/MilosKuzmanovic/MFW
3. npx angular-cli-ghpages --dir=www
4. Go to gh-pages branch and in index.html set to base element href="/MFW/"


1. npx ng build --configuration production --base-href=/MFW/ 
2. npx angular-cli-ghpages --dir=www --no-silent
