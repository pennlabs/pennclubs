from django.core.management.base import BaseCommand
from django.utils import timezone

from clubs.models import Membership


class Command(BaseCommand):
    help = (
        "Mark all memberships where the student has graduated as inactive. "
        "This script should be run at the beginning of each year."
    )
    web_execute = True

    def handle(self, *args, **kwargs):
        now = timezone.now()
        latest_year = now.year - 1
        num_rows = Membership.objects.filter(
            active=True, person__profile__graduation_year__lte=latest_year
        ).update(active=False)
        self.stdout.write(
            self.style.SUCCESS(
                f"Updated the membership status of {num_rows} student club relationships!"
            )
        )
