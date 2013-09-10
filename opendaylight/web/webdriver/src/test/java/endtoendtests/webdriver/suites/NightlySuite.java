package endtoendtests.webdriver.suites;

import org.junit.experimental.categories.Categories;
import org.junit.experimental.categories.Categories.IncludeCategory;
import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;

import endtoendtests.webdriver.categories.NightlyTest;
import endtoendtests.webdriver.tests.AllControllerTests;

@RunWith(Categories.class)
@IncludeCategory(NightlyTest.class)
@SuiteClasses({AllControllerTests.class})
public class NightlySuite {

}
