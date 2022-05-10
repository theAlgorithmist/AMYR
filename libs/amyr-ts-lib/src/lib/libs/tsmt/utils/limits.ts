/* copyright (c) 2012, Jim Armstrong.  All Rights Reserved.
 *
 * THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * This software may be modified for commercial use as long as the above copyright notice remains intact.
 */

/**
 *
 * AMYR Library: Some useful limits for (IEEE 754) floating-point computation.
 * Credit to Michael Baczynski, polygonal ds
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
export enum Limits
{
  INT8_MIN   = 0x80,
  INT8_MAX   = 0x7F,
  UINT8_MAX  = 0xFF,
  INT16_MIN  = -0x8000,
  INT16_MAX  = 0x7FFF,
  UINT16_MAX = 0xFFFF,
  INT32_MIN  = 0x80000000,
  INT32_MAX  = 0x7fffffff,
  UINT32_MAX = 0xffffffff,
  INT_BITS   = 32,
  FLOAT_MAX  = 3.40282346638528e+38,
  FLOAT_MIN  = -3.40282346638528e+38,
  DOUBLE_MAX = 1.79769313486231e+308,
  DOUBLE_MIN = -1.79769313486231e+308
}
