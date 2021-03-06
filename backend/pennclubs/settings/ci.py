from pennclubs.settings.base import *  # noqa: F401, F403


TEST_RUNNER = "xmlrunner.extra.djangotestrunner.XMLTestRunner"
TEST_OUTPUT_VERBOSE = 2
TEST_OUTPUT_DIR = "test-results"

# Use dummy cache for testing
CACHES = {"default": {"BACKEND": "django.core.cache.backends.dummy.DummyCache"}}
