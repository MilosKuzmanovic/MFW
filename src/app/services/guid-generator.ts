/**
 * Utility class for generating GUIDs (Globally Unique Identifiers)
 */
export class GuidGenerator {
  private static readonly GUID_PATTERN = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  private static readonly HEX_BASE = 16;
  private static readonly VERSION_MASK = 0x3;
  private static readonly VARIANT_MASK = 0x8;

  /**
   * Generates a new GUID (UUID v4)
   * @returns A new GUID string
   */
  static newGuid(): string {
    return this.GUID_PATTERN.replace(/[xy]/g, (char) => {
      const randomValue = Math.random() * this.HEX_BASE;
      const randomInt = Math.floor(randomValue);
      
      // For 'x' characters, use random value
      // For 'y' characters, use variant bits (10xx)
      const value = char === 'x' ? randomInt : (randomInt & this.VERSION_MASK) | this.VARIANT_MASK;
      
      return value.toString(this.HEX_BASE);
    });
  }

  /**
   * Generates multiple GUIDs
   * @param count Number of GUIDs to generate
   * @returns Array of GUID strings
   */
  static generateMultiple(count: number): string[] {
    if (count <= 0) {
      return [];
    }

    const guids: string[] = [];
    for (let i = 0; i < count; i++) {
      guids.push(this.newGuid());
    }
    return guids;
  }

  /**
   * Validates if a string is a valid GUID format
   * @param guid String to validate
   * @returns True if valid GUID format
   */
  static isValidGuid(guid: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(guid);
  }
}
