


```
nvm install
nvm use
```

## email

```
docker run -d -p 1080:1080 -p 1025:1025 --name mailcatcher schickling/mailcatcher
```

1.  `* * * * *`
    * **Runs:** Every minute.

2.  `0 * * * *`
    * **Runs:** At the start of every hour (e.g., 01:00, 02:00, 03:00...).

3.  `30 * * * *`
    * **Runs:** At 30 minutes past every hour (e.g., 01:30, 02:30, 03:30...).

4.  `0 0 * * *`
    * **Runs:** At midnight every day.

5.  `0 9 * * *`
    * **Runs:** At 9:00 AM every day.

6.  `0 0 * * 1`
    * **Runs:** At midnight every Monday. (Sunday is `0` or `7`, Monday is `1`, Tuesday is `2`, etc.)

7.  `0 0 1 * *`
    * **Runs:** At midnight on the 1st day of every month.

8.  `0 0 1 1 *`
    * **Runs:** At midnight on January 1st (start of every year).

9.  `*/15 * * * *`
    * **Runs:** Every 15 minutes. (Uses the step value `/`)

10. `0 9,17 * * 1-5`
    * **Runs:** At 9:00 AM and 5:00 PM (17:00) every weekday (Monday through Friday). (Uses list `,` and range `-`)
