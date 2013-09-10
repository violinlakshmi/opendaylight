package endtoendtests.webdriver.tests;

import org.junit.Test;
import org.junit.experimental.categories.Category;

import endtoendtests.webdriver.categories.NightlyTest;
import endtoendtests.webdriver.categories.SanityTest;


/**
 * Example end to end tests.
 * 
 */
public class SmallTest extends BaseTest {

    @Test
    @Category({SanityTest.class, NightlyTest.class})
    public void testLogin() {
    
    }
}
